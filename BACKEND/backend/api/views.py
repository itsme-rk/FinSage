from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics,viewsets, permissions
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Expense
from .serializers import ExpenseSerializer
from .permissions import IsOwnerOrAdmin

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime
# Create your views here.

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

#end point: /users/
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# endpoi: /expenses/
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]


    #endpoint: /expenses/
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Expense.objects.all().order_by('-date')
        return Expense.objects.filter(user=user).order_by('-date')

    #endpoint: /expenses/
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



    # endpoint: /expenses/summary/
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Return total income, expenses, and balance for the logged-in user"""
        user = request.user
        qs = self.get_queryset()

        total_income = qs.filter(expense_type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = qs.filter(expense_type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        balance = total_income - total_expense

        category_breakdown = (
            qs.filter(expense_type='EXPENSE')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance,
            'category_breakdown': category_breakdown,
        })


# /api/expenses/status/pending/
# /api/expenses/status/approved/
# /api/expenses/status/rejected/
    # Custom endpoint to filter by status
    @action(detail=False, methods=['get'], url_path='status/(?P<status>[^/.]+)')
    def filter_by_status(self, request, status=None):
        qs = self.get_queryset().filter(status=status.upper())
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
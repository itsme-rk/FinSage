from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet

router = DefaultRouter()
router.register(r'', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('expenses/', include(router.urls)),
    path('expenses/summary/', ExpenseViewSet.as_view({'get': 'summary'}), name='expense-summary'),
]


# from django.urls import path
# from . import views

# urlpatterns = [
#     path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
#     path('expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
#     path('expenses/summary/', views.ExpenseSummaryView.as_view(), name='expense-summary'),
# ]

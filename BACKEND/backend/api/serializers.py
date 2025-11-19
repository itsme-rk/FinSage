from rest_framework import serializers
from .models import CustomUser,Expense
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},
            'role': {'read_only': True},  
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user', 'status']  

    def update(self, instance, validated_data):
        # if admin updates, allow status change
        request = self.context.get('request')
        if request and request.user.role == 'ADMIN':
            return super().update(instance, validated_data)
        # else block status change from normal users
        validated_data.pop('status', None)
        return super().update(instance, validated_data)

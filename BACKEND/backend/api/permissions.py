from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to allow only owners or admins to edit/delete objects.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.role == 'ADMIN':
            return True
        # Safe methods (GET, HEAD, OPTIONS) allowed for owners
        if request.method in SAFE_METHODS:
            return obj.user == request.user
        # Write methods allowed only if they own the expense
        return obj.user == request.user

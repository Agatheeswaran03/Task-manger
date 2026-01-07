from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    try:
        # Check if request.data is empty or malformed
        if not request.data:
            return Response({
                'error': 'No data provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as save_error:
                import traceback
                print(f"Error saving user: {str(save_error)}")
                print(traceback.format_exc())
                return Response({
                    'error': f'Failed to create user: {str(save_error)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Format validation errors for better frontend display
        errors = {}
        for field, messages in serializer.errors.items():
            if isinstance(messages, list):
                errors[field] = messages[0] if messages else 'Invalid value'
            else:
                errors[field] = str(messages)
        
        return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        import traceback
        print(f"Registration error: {str(e)}")
        print(traceback.format_exc())
        return Response({
            'error': f'Registration failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

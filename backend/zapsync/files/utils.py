import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

def decode_jwt(token):
    try:
        # Decode the token using the secret key and HS256 algorithm
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return decoded['user_id']  # Assuming 'user_id' is stored in the token
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('token expired')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token')

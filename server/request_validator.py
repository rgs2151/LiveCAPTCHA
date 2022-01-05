from flask import request

class SecretKeyInvalid(Exception): 
    def __init__(self, message, code=4): 
        self.message = message
        self.code = code
def validate_secret_R(request: request, key='secret'):
    try:
        req = request.json
        # return {'ERROR': False, 'secret': req[key], 'message': 'success'}
        if req:
            if key not in req: raise SecretKeyInvalid(f'secret key |{key}| missing')
            value = req[key]
            if not isinstance(value, str): raise SecretKeyInvalid(f'secret key NOT str')
            if len(value) != 16: raise SecretKeyInvalid(f'secret key length incorrect')
            return {'ERROR': False, 'secret': value, 'message': 'success'}
        else:
            raise SecretKeyInvalid('request not json serializable', 5)

    except SecretKeyInvalid as err:
        return {'ERROR': True, 'secret': None, 'message':err.message, 'CODE': err.code}
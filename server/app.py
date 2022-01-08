from flask import Flask, json
from flask import render_template
from flask import request
# import json
from flask_cors import CORS
from handler import MySQLConnect, CalculateResult, DataPreprocess


app = Flask(__name__, static_url_path='/static',template_folder="static/templates")
CORS(app)

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'captcha'

app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config["send_file"] = True
app.config["send_from_directory"] = True

cors = CORS(app)
sql = MySQLConnect(app)
score_calculator = CalculateResult(sql)
calc = DataPreprocess(sql)

from request_validator import validate_secret_R
@app.route("/secret_code_check", methods=['POST'])
def secret_code_check():
    '''
    request: {
        "secret": 16digit varchar required
    }
    '''
    result = validate_secret_R(request)
    if not result['ERROR']:
        secret = result['secret']
        domain = result['domain']
        if not sql.check_client_licence_code_exists(secret, domain):
            result = {'ERROR': True, 'secret': None, 'message': 'secret invalid', 'CODE': 4}

    # validate secret from client table here

    return result

@app.route("/success_count", methods=['POST'])
def success_count():
    result = validate_secret_R(request)
    if not result['ERROR']:
        secret = result['secret']
        domain = result['domain']
        if not sql.check_client_licence_code_exists(secret, domain):
            result = {'ERROR': True, 'secret': None, 'message': 'secret invalid', 'CODE': 4}
        else:
            sql.increment_count(secret, domain)
            result = {'ERROR': False, 'secret': None, 'message': 'Success', 'CODE': 0}
    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=False)
from flask import Flask, request, jsonify, make_response
import sqlite3
import os

api = Flask(__name__)

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@api.after_request
def after_request(response):
    return add_cors_headers(response)

def ConnectDB():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(current_dir, '..', 'db','impiegati.db')
        return sqlite3.connect(db_path)
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        raise

@api.route('/api/impiegati', methods=['GET'])
def get_impiegati():
    try:
        connection = ConnectDB()
        cursor = connection.cursor()
        query = "SELECT * FROM impiegato;"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/datori', methods=['GET'])
def get_datori():
    try:
        connection = ConnectDB()
        cursor = connection.cursor()
        query = "SELECT * FROM datore;"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    api.run(host="127.0.0.1", port=8080, debug=True)

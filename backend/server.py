from flask import Flask, request, jsonify, send_from_directory
import os
# Import the process_query function
from retrieval import process_query

app = Flask(__name__, static_folder='../frontend/build')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/search', methods=['POST'])
    
def search():
    data = request.json
    query = data.get('query')
    result = process_query(query)
    return jsonify(answer=result)

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, send_from_directory
import os

# Import the process_query function from the place where you've defined it
from retrieval import process_query  # If retrieval.py is in the same directory as server.py

app = Flask(__name__, static_folder='../frontend/dist')  # Adjust if necessary

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query')
    # Ensure you have proper error handling here in case 'query' is None
    result = process_query(query)
    return jsonify(answer=result)

if __name__ == '__main__':
    # It's typically a good practice to avoid running with debug=True in production settings
    app.run(host='0.0.0.0', port=5000, debug=True)

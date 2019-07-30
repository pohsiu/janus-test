#!/usr/bin/env python

from flask import Flask
import subprocess
import os

app = Flask(__name__)

@app.route('/<string:room_id>', methods=['GET'])
def hello(room_id):
    subprocess.Popen(["bash", "/processVideo.sh", room_id])
    return "Process Finished!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
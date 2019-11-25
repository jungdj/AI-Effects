#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
from flask import Flask
from flask_restful import Resource, Api, reqparse
from config import (
  basedir,
  PORT_NUMBER,
  HTTP,
  ADDR,
)

app = Flask(__name__)

api = Api(app)

@app.route('/')
@app.route('/index')
def index():
  return "test: hello world!"

class Temp(Resource):
    def post(self):
      return
    def get(self):
      return 'hello...?'

api.add_resource(Temp, "/temp")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)

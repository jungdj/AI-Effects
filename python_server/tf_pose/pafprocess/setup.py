from distutils.core import setup, Extension
import numpy
import os

# os.environ['CC'] = 'g++';
setup(name='pafprocess_ext', version='1.0',
    ext_modules=[
        Extension('_pafprocess', ['pafprocess.cpp', 'pafprocess.i'],
                  swig_opts=['-c++'],
                  extra_compile_args = ['-stdlib=libc++'],
                  extra_link_args=['-stdlib=libc++'],
                  depends=["pafprocess.h"],
                  include_dirs=[numpy.get_include(), '.'])
    ],
    py_modules=[
        "pafprocess"
    ]
)

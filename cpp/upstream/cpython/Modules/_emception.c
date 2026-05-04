#ifndef Py_BUILD_CORE_BUILTIN
#  define Py_BUILD_CORE_MODULE 1
#endif

#include "Python.h"

PyDoc_STRVAR(module_doc,
"A Emception helper module.");

#if defined(__EMSCRIPTEN__)

#include <emscripten.h>

PyDoc_STRVAR(emception_eval_doc,
"eval(code)\n\
\n\
Evaluate javascript code.\n\
");

EM_JS(char *, emception_eval_impl, (const char *code), {
    return allocateUTF8(JSON.stringify(eval(UTF8ToString(code))) || "");
})

static PyObject *
emception_eval(PyObject *module, PyObject *args)
{
    const char *code = NULL;
    const char *result = NULL;
    PyObject * ret = NULL;

    if (!PyArg_ParseTuple(args, "s:emception_eval", &code))
        return NULL;

    result = emception_eval_impl(code);
    ret = PyUnicode_FromFormat("%s", result);
    free((void*)result);

    return ret;
}

#if defined(__EMSCRIPTEN_ASYNCIFY__)

PyDoc_STRVAR(emception_async_eval_doc,
"async_eval(code)\n\
\n\
Evaluate async javascript code.\n\
");

EM_ASYNC_JS(char *, emception_async_eval_impl, (const char *code), {
    return allocateUTF8(JSON.stringify(await eval(UTF8ToString(code))) || "");
})

static PyObject *
emception_async_eval(PyObject *module, PyObject *args)
{
    const char *code = NULL;
    const char *result = NULL;
    PyObject * ret = NULL;

    if (!PyArg_ParseTuple(args, "s:emception_async_eval", &code))
        return NULL;

    result = emception_async_eval_impl(code);
    ret = PyUnicode_FromFormat("%s", result);
    free((void*)result);

    return ret;
}

#endif // defined(__EMSCRIPTEN_ASYNCIFY__)
#endif // defined(__EMSCRIPTEN__)

static struct PyModuleDef _emceptionmodule;

/* module level code ********************************************************/

static PyMethodDef module_methods[] = {
#if defined(__EMSCRIPTEN__)
    {"eval", emception_eval, METH_VARARGS, emception_eval_doc},
#if defined(__EMSCRIPTEN_ASYNCIFY__)
    {"async_eval", emception_async_eval, METH_VARARGS, emception_async_eval_doc},
#endif // defined(__EMSCRIPTEN_ASYNCIFY__)
#endif // defined(__EMSCRIPTEN__)
    {NULL, NULL}  /* sentinel */
};

static PyModuleDef_Slot _emception_slots[] = {
    {0, NULL}
};

static struct PyModuleDef _emceptionmodule = {
        PyModuleDef_HEAD_INIT,
        .m_name = "_emception",
        .m_doc = module_doc,
        .m_size = 0,
        .m_methods = module_methods,
        .m_slots = _emception_slots,
};

PyMODINIT_FUNC
PyInit__emception(void)
{
    return PyModuleDef_Init(&_emceptionmodule);
}
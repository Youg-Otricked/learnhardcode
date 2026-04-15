#include <iostream>
#include <initializer_list>
#include <algorithm>
template <typename T, int S = 1>
class FSizeArr {
private:
    T* data;
public:
    int length;
    FSizeArr(std::initializer_list<T> init) {
        this->length = S > 1 ? S : 1;
        this->data = new T[this->length];
        std::copy(init.begin(), init.end(), this->data);
    }
    FSizeArr() {
        this->length = S > 1 ? S : 1;
        this->data = new T[this->length];
    }
    T& operator[](size_t index) {
        return this->data[index];
    }
    const T& operator[](size_t index) const {
        return this->data[index];
    }
};
#include <iostream>
#include <initializer_list>
#include <algorithm>
template <typename T, int S = 1>
class FSizeArr {
private:
    T* value;
public:
    int length;
    FSizeArr(std::initializer_list<T> init) {
        this->length = S > 1 ? S : 1;
        this->value = new T[this->length];
        std::copy(init.begin(), init.end(), this->value);
    }
    FSizeArr() {
        this->length = S > 1 ? S : 1;
        this->value = new T[this->length];
    }
    ~FSizeArr() {
        delete[] this->value;
        this->value = nullptr;
    }
    T& operator[](size_t index) {
        return this->value[index];
    }
    const T& operator[](size_t index) const {
        return this->value[index];
    }
    const T back() const {
        return this->value[this->length - 1];
    }
    const T front() const {
        return this->value[0];
    }
    const T* data() const {
        return this->value;
    }
};
int _pass = 0;
int _fail = 0;
void _test(int num, int got, int expected) {
    bool passed = got == expected;
    std::cout << "---------------------\n";
    std::cout << "Test " << num << ":\n";
    std::cout << (passed ? "Pass\n" : "Fail\n") << "\n";
    if (passed) _pass++; else _fail++;
}

int main() {
    FSizeArr<int, 3> tester1 = {1, 2, 3};
    tester1.~FSizeArr();
    _test(1, 1, tester1.data() == nullptr ? 1 : 0);
    std::cout << "---------------------\n";
    std::cout << _pass << " passed, " << _fail << " failed\n";
    return 0;
}

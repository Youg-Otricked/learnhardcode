#include <iostream>

template <typename T>
T add(T left, T right); // student function
bool allok = true;
template <typename T>
void check_add(T a, T b, T expected, const char* label) {
    T result = add(a, b);
    if (result == expected) {
        std::cout << "PASS: " << label << " == " << expected << "\n";
    } else {
        allok = false;
        std::cout << "FAIL: " << label << " was " << result
                  << ", expected " << expected << "\n";
    }
}

int main() {
    check_add<int>(2, 3, 5, "add(2, 3)");
    check_add<double>(1.5, 2.5, 4.0, "add(1.5, 2.5)");
    if (allok) { 
        std::cout << "[PASS]";
    }
}
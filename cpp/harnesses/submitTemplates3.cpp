#include <iostream>

template <typename T>
T maxOf(T a, T b); // student function
bool allok = true;
template <typename T>
void check_maxOf(T a, T b, T expected, const char* label) {
    T result = maxOf(a, b);
    if (result == expected) {
        std::cout << "PASS: " << label << " == " << expected << "\n";
    } else {
        allok = false;
        std::cout << "FAIL: " << label << " was " << result
                  << ", expected " << expected << "\n";
    }
}

int main() {
    check_maxOf<int>(3, 7, 7, "maxOf(3, 7)");
    check_maxOf<float>(2.5f, 1.5f, 2.5f, "maxOf(2.5f, 1.5f)");
    check_maxOf<double>(4.0, 4.5, 4.5, "maxOf(4.0, 4.5)");
    if (allok) { 
        std::cout << "[PASS]";
    }
}
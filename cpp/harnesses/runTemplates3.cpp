#include <iostream>

template <typename T>
T maxOf(T a, T b); // student function

int main() {
    // Just show the three example calls
    std::cout << maxOf(3, 7) << "\n";
    std::cout << maxOf(2.5f, 1.5f) << "\n";
    std::cout << maxOf(4.0, 4.5) << "\n";
}
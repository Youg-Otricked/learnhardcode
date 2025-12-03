#include <iostream>

int factorial(int a);

int main() {
    if (factorial(4) != 24) {
        std::cout << "[FAIL] factorial 4 should be 24";
    } else {
        std::cout << "[PASS] factorial 4 = 24";
    }
    return 0;

}
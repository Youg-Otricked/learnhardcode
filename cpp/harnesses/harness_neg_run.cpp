#include <iostream>

bool IsNegative(int); // student's function

int main() {
    if (IsNegative(-9) != true) {
        std::cout << "[FAIL] -9 should give output true\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](1/1)\n(1/1): -9 is negative.\n";
    return 0;
}
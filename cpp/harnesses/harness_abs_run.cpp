#include <iostream>

int abs(int); // student's function

int main() {
    if (abs(-9) != 9) {
        std::cout << "[FAIL] -9 should give output 9\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](1/1)\n(1/1): -9's abs is 9.\n";
    return 0;
}
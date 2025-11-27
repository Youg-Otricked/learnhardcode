#include <iostream>

int add(int, int); // student's function

int main() {
    if (add(1, 2) != 3) {
        std::cout << "[FAIL] add(1, 2) should be 3\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](1/1)\n(1/1): 1+2 = 3\n";
    return 0;
}
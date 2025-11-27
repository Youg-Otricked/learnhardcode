#include <iostream>

std::string IsEven(int); // student's function

int main() {
    if (IsEven(3) != "Odd") {
        std::cout << "[FAIL] IsEven(3) should be Odd\n";
        std::cout << "-------------------------\n[FAIL](1 FAILED, 0 SUCCESSFUL, 3 SKIPPED)\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](0 FAILED, 1 SUCCESSFUL, 3 SKIPPED)\n(1/1): 3 is Odd\n";
    return 0;
}
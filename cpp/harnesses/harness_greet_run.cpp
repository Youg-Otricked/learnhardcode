#include <iostream>

std::string greet(std::string); // student's function

int main() {
    if ((greet("User") != "Hello, User.") ||
        (greet("Alice") != "Hello, Alice.")) {
        std::cout << "[FAIL] > 0 greets failed.\n";
        std::cout << "-------------------------\n[FAIL](? FAILED, 0 SUCCESSFUL, 4 SKIPPED)\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](0 FAILED, 2 SUCCESSFUL, 4 SKIPPED)\n";
    return 0;
}
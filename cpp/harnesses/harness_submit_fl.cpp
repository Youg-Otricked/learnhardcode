#include <iostream>

int factorial(int a);
bool allpas = true;
void check_factorial(int input, int expected) {
    int result = factorial(input);
    if (result == expected) {
        std::cout << "CORRECT: factorial(" << input << ") == " << expected << "\n";
    } else {
        allpas=false;
        std::cout << "FAIL: factorial(" << input << ") was " << result
                  << ", expected " << expected << "\n";
    }
}

int main() {
    check_factorial(0, 1);
    check_factorial(1, 1);
    check_factorial(4, 24);
    check_factorial(5, 120);
    if (allpas) {
        std::cout << "[PASS] 4/4";
    } else {
        std::cout << "Fail. >0 failed.";
    }
}
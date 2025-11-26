#include <iostream>

int add(int, int);

int main() {
    if (add(1, 2) != 3) {
        std::cout << "[FAIL] Basic test failed\n";
        return 1;
    }
    std::cout << "[PASS]\n"; // for "Run" you might even print more detail
    return 0;
}
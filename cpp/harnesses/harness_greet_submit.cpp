#include <iostream>
#include <string>

std::string greet(std::string); // student's function

int main() {
    struct Case {
        std::string name;
        std::string expected;
    } cases[] = {
        {"User", "Hello, User."},
        {"Alice", "Hello, Alice."},
        {"", "Hello, ."},
        {"Lane", "Hello, Lane."},
        {"LearnHardCodeCreator", "Hello, LearnHardCodeCreator."}
    };

    bool all_ok = true;
    int ttlc = 0;
    int failed = 0;
    for (auto c : cases) {
        std::string got = greet(c.name);
        if (got != c.expected) {
            ttlc ++;
            failed ++;
            std::cout << "[FAIL] greet(" << c.name
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc << "/5)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/5) " << c.expected << '\n';
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] (5/5)\n";
        return 0;
    }
    std::cout << "------------------------" << '\n' << "[FAIL] (" << ttlc - failed << "/5 passed, (" << failed << "/5 failed)\n";
    return 1;
}
#include <iostream>
#include <string>

std::string IsEven(int); // student's function

int main() {
    struct Case {
        int a;
        std::string expected;
    } cases[] = {
        {3, "Odd"},
        {138457, "Odd"},
        {0, "Zero"},
        {2, "Even"}
    };

    bool all_ok = true;
    int ttlc = 0;
    int failed = 0;
    for (auto c : cases) {
        std::string got = IsEven(c.a);
        if (got != c.expected) {
            ttlc ++;
            failed ++;
            std::cout << "[FAIL] IsEven(" << c.a
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc << "/4)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/4) " << c.a << "is" <<  c.expected << '\n';
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] (4/4)\n";
        return 0;
    }
    std::cout << "------------------------" << '\n' << "[FAIL] (" << ttlc - failed << "/4 passed, (" << failed << "/4 failed)\n";
    return 1;
}
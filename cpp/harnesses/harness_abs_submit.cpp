#include <iostream>

int abs(int); // student's function

int main() {
    struct Case {
        int a;
        int expected;
    } cases[] = {
        {1, 1},
        {-1, 1},
        {0, 0},
        {1000, 1000},
        {-176, 176}
    };

    bool all_ok = true;
    int ttlc = 0;
    int failed = 0;
    for (auto c : cases) {
        int got = abs(c.a);
        if (got != c.expected) {
            ttlc ++;
            failed ++;
            std::cout << "[FAIL] abs(" << c.a
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc << "/5)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/5) " << c.a << " abs is " <<  c.expected << '\n';
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] (5/5)\n";
        return 0;
    }
    std::cout << "------------------------" << '\n' << "[FAIL] (" << ttlc - failed << "/5 passed, (" << failed << "/5 failed)\n";
    return 1;
}
#include <iostream>

int add(int, int); // student's function

int main() {
    struct Case {
        int a, b, expected;
    } cases[] = {
        {1, 2, 3},
        {-1, 5, 4},
        {0, 0, 0},
        {1000, -1000, 0}
    };

    bool all_ok = true;
    int ttlc = 0;
    for (auto c : cases) {
        int got = add(c.a, c.b);
        if (got != c.expected) {
            std::cout << "[FAIL] add(" << c.a << ", " << c.b
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc + 1 << "/3)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "(" << ttlc << "/3) " << c.a << " + " << c.b << " = " <<  c.expected << '\n';
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] 3/3\n";
        return 0;
    }
    return 1;
}
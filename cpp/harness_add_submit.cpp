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

    for (auto c : cases) {
        int got = add(c.a, c.b);
        if (got != c.expected) {
            std::cout << "[FAIL] add(" << c.a << ", " << c.b
                      << ") expected " << c.expected
                      << " got " << got << "\n";
            all_ok = false;
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] 3/3\n";
        return 0;
    }
    return 1;
}
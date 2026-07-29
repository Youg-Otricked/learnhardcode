int _pass = 0;
int _fail = 0;
void _test(int num, int got, int expected) {
    bool passed = got == expected;
    std::cout << "---------------------\n";
    std::cout << "Test " << num << ":\n";
    std::cout << (passed ? "Pass\n" : "Fail\n") << "\n";
    if (passed) _pass++; else _fail++;
}

int main() {
    Stack<int> tester1 = {1, 2, 3};
    tester1.push(91);
    _test(1, 91, tester1.top());
    tester1.top() = 12;
    _test(1, 12, tester1.top());
    _test(1, 12, tester1.pop());
    _test(1, 3, tester1.top());
    std::cout << "---------------------\n";
    std::cout << _pass << " passed, " << _fail << " failed\n";
    return 0;
}


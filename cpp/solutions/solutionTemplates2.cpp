
#include <iostream>
//don't touch above
template <typename T, typename B>
auto add(T left, B right) {
    return left + right;
}
//don't touch below
bool allok = true;
template <typename T, typename B, typename C>
void check_add(T a, B b, C expected, const char* label) {
    auto result = add(a, b);
    if (result == expected) {
        std::cout << "PASS: " << label << " == " << expected << "\n";
    } else {
        allok = false;
        std::cout << "FAIL: " << label << " was " << result
                  << ", expected " << expected << "\n";
    }
}

int main() {
    check_add<int>(2, 3, 5, "add(2, 3)");
    check_add<double>(1.5, 2.5f, 4.0, "add(1.5, 2.5f)");
    check_add<long>(100, 20.99, 120.99, "add(100, 20.99)");
    if (allok) { 
        std::cout << "[PASS]";
    }
}
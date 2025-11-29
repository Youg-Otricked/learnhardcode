#include <iostream>
#include <string>
 // student's function
std::string makeDir(std::string, std::string, std::string);
std::string makeDir(std::string, std::string, std::string, std::string);
std::string makeDir(std::string, std::string, std::string, std::string, std::string);
//Dirname contents are: item1, item2, item3, item4

int main() {
    struct Case1 {
        std::string a, b, c, expected;
    } cases[] = {
        {"Funny", "FunnyVirus.exe", "BananaDuck.txt", "Funny contents are: FunnyVirus.exe, BananaDuck.txt"},
        {"Weirdo", "Iggmail", "MOBY SICK", "Weirdo contents are: Iggmail, MOBY SICK"}
    };
    struct Case2 {
        std::string a, b, c, d, expected;
    } cases2[] = {
        {"Funny", "FunnyVirus.exe", "BananaDuck.txt", "Hamburgercheesebrher", "Funny contents are: FunnyVirus.exe, BananaDuck.txt, Hamburgercheesebrher"}
    };
    struct Case3 {
        std::string a, b, c, d, e, expected;
    } cases3[] = {
        {"Banned", "TikTok.exe", "YoutubeShorts.exe", "Instagram.exe", "Shortformmedia", "Banned contents are: TikTok.exe, YoutubeShorts.exe, Instagram.exe, Shortformmedia"}
    };

    bool all_ok = true;
    int ttlc = 0;
    for (auto c : cases) {
        std::string got = makeDir(c.a, c.b, c.c);
        if (got != c.expected) {
            std::cout << "[FAIL] makeDir(" << c.a << ", " << c.b << ", " << c.c
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc + 1 << "/4)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/4) " << "got " << c.expected << '\n';
        }
    }
    for (auto c : cases2) {
        std::string got = makeDir(c.a, c.b, c.c, c.d);
        if (got != c.expected) {
            std::cout << "[FAIL] makeDir(" << c.a << ", " << c.b << ", " << c.c << ", " << c.d
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc + 1 << "/4)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/4) " << "got " << c.expected << '\n';
        }
    }
    for (auto c : cases3) {
        std::string got = makeDir(c.a, c.b, c.c, c.d, c.e);
        if (got != c.expected) {
            std::cout << "[FAIL] makeDir(" << c.a << ", " << c.b << ", " << c.c << ", " << c.d << ", " << c.e
                      << ") expected " << c.expected
                      << " got " << got << "\n" << "(" << ttlc + 1 << "/4)" << '\n';
            all_ok = false;
        } else {
            ttlc ++;
            std::cout << "------------------------" << '\n' << "[SUCCESS] (" << ttlc << "/4) " << "got " << c.expected << '\n';
        }
    }

    if (all_ok) {
        std::cout << "------------------------" << '\n' << "[PASS] (4/4)\n";
        return 0;
    }
    return 1;
}
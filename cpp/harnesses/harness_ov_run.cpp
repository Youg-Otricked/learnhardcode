#include <iostream>
#include <string>

 // student's function
std::string makeDir(std::string, std::string, std::string);
std::string makeDir(std::string, std::string, std::string, std::string);
std::string makeDir(std::string, std::string, std::string, std::string, std::string);
//Dirname contents are: item1, item2, item3, item4
int main() {
    if (makeDir("Funny", "FunnyVirus.exe", "BananaDuck.txt") != "Funny contents are: FunnyVirus.exe, BananaDuck.txt") {
        std::cout << "[FAIL] makeDir(\"Funny\", \"FunnyVirus.exe\", \"BananaDuck.txt\") should return Funny contents are: FunnyVirus.exe, BananaDuck.txt\n";
        return 1;
    }
    if (makeDir("Code", "Code.cpp", "harness_ov_run.cpp", "igmail.cs") != "Code contents are: Code.cpp, igmail.cs") {
        std::cout << "[FAIL] makeDir(\"Code\", \"Code.cpp\", \"harness_ov_run.cpp\", \"igmail.cs\") should return Code contents are: Code.cpp, igmail.cs\n";
        return 1;
    }
    std::cout << "--------------------------\n[PASS](2/2)\n";
    return 0;
}
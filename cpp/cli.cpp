#include <iostream>
#include <cstdio>
#include <array>
#include <fstream>
#include <string>
#include <unordered_map>
#include <iomanip>
#include <functional>
#include <sstream>
#include <iterator>
#include "json.hpp"
void handlerCreateLesson(int numArgs, char* args[]);
void handlerCreateCourse(int numArgs, char* args[]);
void handlerRun(int numArgs, char* args[]);
std::string getHomePath(const std::string& subPath) {
    const char* home = std::getenv("HOME");
    if (!home) return subPath;
    return std::string(home) + "/" + subPath;
}
std::unordered_map<std::string, std::unordered_map<char*, char*>> courses = {};
std::unordered_map<std::string, std::function<void(int, char*[])>> commands = {{"c-course", handlerCreateCourse}, {"c-lesson", handlerCreateLesson}, {"run", handlerRun}};
std::string generateShortID(const std::string& input) {
    unsigned int hash = 2166136261u;
    for (char c : input) {
        hash ^= static_cast<unsigned char>(c);
        hash *= 16777619u;
    }
    std::stringstream ss;
    ss << std::hex << std::setw(8) << std::setfill('0') << hash;
    return ss.str();
}
void editConfig(char* field, char* value) {
    std::ifstream file_in(getHomePath("user_config.json"));
    nlohmann::json data = nlohmann::json::parse(file_in);
    data[field] = value;
    std::ofstream file_out(getHomePath("user_config.json"));
    file_out << data.dump(4);
}
std::string readConfig(char* field) {
    std::ifstream file_in(getHomePath("user_config.json"));
    nlohmann::json data = nlohmann::json::parse(file_in);
    return data[field];
}
std::string getCourseLang
void createFile(const std::string& name, const std::string& contents) {
    std::string path = getHomePath("cli_lessons/" + name);
    std::ofstream userJson(path);
    if (userJson.is_open()) {
        userJson << contents;
    }
}
std::string exec(const char* cmd) {
    std::array<char, 128> buffer;
    std::string result;
    FILE* pipe = popen(cmd, "r"); 
    if (!pipe) return "popen() failed!";

    try {
        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr) {
            result += buffer.data();
        }
    } catch (...) {
        pclose(pipe);
        throw;
    }
    pclose(pipe);
    return result;
}
void handlerCreateLesson(int numArgs, char* args[]) {
    if (numArgs < 3) throw "Usage: lhc c-lesson <title> <json>";
    std::string title = args[0];
    std::string json = args[1];
    std::string combined = course + ":" + lang + ":" + title;
    std::string lessonID = generateShortID(combined);
    std::cout << "Lesson Hash: " << lessonID << std::endl;
}
void handlerCreateCourse(int numArgs, char* args[]) {

}
void handlerRun(int numArgs, char* args[]) {

}
int main(int argc, char* argv[]) {
    if (argc == 0) {
        throw "Usage: `lhc <args>";
    }
    std::string command_name = argv[1];
    auto it = commands.find(command_name);
    if (it == commands.end()) {
        throw "Command " + command_name + " Doesn't exist.";
    }
    try {
        it->second(argc - 2, argv + 2);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
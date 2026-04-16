#include <iostream>
template <typename T>
class FSizeArr {
public:
	T* data;
    // Write the constructor here
        FSizeArr(int size) {
		this->data = new T[size];
	}

};
int main() {
	FSizeArr<int> n = FSizeArr<int>(13);
	std::cout << sizeof(*n.data);
}


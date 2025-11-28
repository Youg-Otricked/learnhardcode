#include <iostream>

void BubbleSort(int arr[], int len);

bool equal_arr(const int* a, const int* b, int len) {
    for (int i = 0; i < len; ++i) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

int main() {
    {
        int arr[5]    = {3, 2, 1, 5, 4};
        int expect[5] = {1, 2, 3, 4, 5};

        BubbleSort(arr, 5);

        if (!equal_arr(arr, expect, 5)) {
            std::cout << "[FAIL] case 1\n";
            return 1;
        }
    }
    {
        int arr[4]    = {10, -1, 7, 0};
        int expect[4] = {-1, 0, 7, 10};

        BubbleSort(arr, 4);

        if (!equal_arr(arr, expect, 4)) {
            std::cout << "[FAIL] case 2\n";
            return 1;
        }
    }
    {
        int arr[9]    = {6, 2, 3, 9, 6, 19, 21, 11, 0};
        int expect[9] = {0, 2, 3, 6, 6, 9, 11, 19, 21};

        BubbleSort(arr, 9);

        if (!equal_arr(arr, expect, 5)) {
            std::cout << "[FAIL] case 4\n";
            return 1;
        }
    }
    {
        int arr[4]    = {10, -1, 7, 0};
        int expect[4] = {-1, 0, 7, 10};

        BubbleSort(arr, 4);

        if (!equal_arr(arr, expect, 4)) {
            std::cout << "[FAIL] case 2\n";
            return 1;
        }
    }

    std::cout << "[PASS]\n";
    return 0;
}
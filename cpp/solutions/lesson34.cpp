void BubbleSort(int arr[], int len) {
    // Standard bubble sort: repeatedly swap adjacent out-of-order elements
    bool swapped = true;
    // After each outer pass, the largest element so far is at the end,
    // so we can shrink the inner loop by one each time.
    for (int pass = 0; pass < len - 1 && swapped; ++pass) {
        swapped = false;
        for (int i = 0; i < len - 1 - pass; ++i) {
            if (arr[i] > arr[i + 1]) {
                int tmp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = tmp;
                swapped = true;
            }
        }
    }
}
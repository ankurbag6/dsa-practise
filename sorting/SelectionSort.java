// Online Java Compiler
// Use this editor to write, compile and run your Java code online
import java.util.Arrays;
class SelectionSort {
   
    static int[] swap(int[] arr, int idx1, int idx2) {
        int tmp = arr[idx1];
        arr[idx1] = arr[idx2];
        arr[idx2] = tmp;
        return arr;
    } 
    // Selection sort
    public static int[] selectionSort(int[] arr) {
        int n = arr.length;
        int minIndx = -1;
        for(int i=0; i<n; i++ ) {
            int minVal = arr[i];
            minIndx = i;
            for(int k=i+1; k<n; k++) {
                // Scan from i+1 to n
                if(arr[k] < minVal) {
                    minVal = arr[k];
                    minIndx = k;
                }
                
            }
            arr = swap(arr, minIndx, i);
        }
        return arr;
    }
    public static void main(String[] args) {
        System.out.println("Start small. Ship something.");
        int[] arr = {8, 0, 9, -1, 4};
        System.out.println(Arrays.toString(arr));
        System.out.println(Arrays.toString(selectionSort(arr)));
        
    }
}
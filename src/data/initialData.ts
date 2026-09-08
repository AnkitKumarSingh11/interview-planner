import { Track } from '@/types/tracker';

export const initialTracks: Track[] = [
  {
    id: 'dsa',
    title: 'DSA Track',
    description: 'Data Structures and Algorithms Preparation Timetable',
    sections: [
      {
        id: 'dsa-1',
        topic: 'Sorting',
        sectionTitle: 'Algorithms',
        startDate: '2026-09-03',
        endDate: '2026-09-03',
        subsections: [
          {
            id: 'dsa-1-sub-1',
            title: 'Sorting Algorithms',
            questions: [
              { id: 'q-dsa-1', title: 'Selection Sort', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-2', title: 'Bubble Sort', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-3', title: 'Insertion Sorting', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-4', title: 'Merge Sorting', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-5', title: 'Quick Sorting', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-2',
        topic: 'Arrays',
        sectionTitle: 'Fundamentals',
        startDate: '2026-09-04',
        endDate: '2026-09-10',
        subsections: [
          {
            id: 'dsa-2-sub-1',
            title: 'Fundamentals',
            questions: [
              { id: 'q-dsa-6', title: 'Linear Search', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-7', title: 'Largest Element', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-8', title: 'Second Largest Element', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-9', title: 'Maximum Consecutive Ones', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-10', title: 'Left Rotate Array by One', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-11', title: 'Left Rotate Array by K Places', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-3',
        topic: 'Arrays',
        sectionTitle: 'Logic Building',
        startDate: '2026-09-04',
        endDate: '2026-09-10',
        subsections: [
          {
            id: 'dsa-3-sub-1',
            title: 'Logic Building',
            questions: [
              { id: 'q-dsa-12', title: 'Move Zeros to End', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-13', title: 'Remove duplicates from sorted array', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-14', title: 'Find missing number', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-15', title: 'Union of two sorted arrays', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-16', title: 'Intersection of two sorted arrays', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-4',
        topic: 'Arrays',
        sectionTitle: 'FAQs(Medium)',
        startDate: '2026-09-04',
        endDate: '2026-09-10',
        subsections: [
          {
            id: 'dsa-4-sub-1',
            title: 'Medium FAQs',
            questions: [
              { id: 'q-dsa-17', title: 'Majority Element-I', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-18', title: 'Leaders in an Array', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-19', title: 'Rearrange array elements by sign', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-20', title: 'Print the matrix in spiral manner', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-21', title: "Pascal's Triangle I", completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-22', title: "Pascal's Triangle II", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-23', title: "Pascal's Triangle III", completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-24', title: 'Rotate matrix by 90 degrees', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-25', title: 'Two Sum', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-26', title: '3 Sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-27', title: '4 Sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-28', title: "Sort an array of 0's 1's and 2's", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-29', title: "Kadane's Algorithm", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-30', title: 'Next Permutation', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-5',
        topic: 'Arrays',
        sectionTitle: 'FAQs(Hard)',
        startDate: '2026-09-04',
        endDate: '2026-09-10',
        subsections: [
          {
            id: 'dsa-5-sub-1',
            title: 'Hard FAQs',
            questions: [
              { id: 'q-dsa-31', title: 'Majority Element-II', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-32', title: 'Find the repeating and missing number', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-33', title: 'Count Inversions', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-34', title: 'Reverse Pairs', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-35', title: 'Maximum Product Subarray in an Array', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-36', title: 'Merge two sorted arrays without extra space', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-6',
        topic: 'Hashing',
        sectionTitle: 'Theory',
        startDate: '2026-09-11',
        endDate: '2026-09-13',
        subsections: [
          {
            id: 'dsa-6-sub-1',
            title: 'Theory',
            questions: [
              { id: 'q-dsa-37', title: 'Basic Hashing', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-7',
        topic: 'Hashing',
        sectionTitle: 'FAQs',
        startDate: '2026-09-11',
        endDate: '2026-09-13',
        subsections: [
          {
            id: 'dsa-7-sub-1',
            title: 'Hashing FAQs',
            questions: [
              { id: 'q-dsa-38', title: 'Longest Consecutive Sequence in an Array', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-39', title: 'Longest subarray with sum K', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-40', title: 'Count subarrays with given sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-41', title: 'Count subarrays with given xor K', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-8',
        topic: 'Binary Search',
        sectionTitle: 'Fundamentals',
        startDate: '2026-09-14',
        endDate: '2026-09-20',
        subsections: [
          {
            id: 'dsa-8-sub-1',
            title: 'Fundamentals',
            questions: [
              { id: 'q-dsa-42', title: 'Search X in sorted array', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-43', title: 'Lower Bound', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-44', title: 'Upper Bound', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-9',
        topic: 'Binary Search',
        sectionTitle: 'Logic Building',
        startDate: '2026-09-14',
        endDate: '2026-09-20',
        subsections: [
          {
            id: 'dsa-9-sub-1',
            title: 'Logic Building',
            questions: [
              { id: 'q-dsa-45', title: 'Search insert position', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-46', title: 'Floor and Ceil in Sorted Array', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-47', title: 'First and last occurrence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-48', title: 'Search in rotated sorted array-I', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-49', title: 'Search in rotated sorted array-II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-50', title: 'Find minimum in Rotated Sorted Array', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-51', title: 'Find out how many times the array is rotated', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-52', title: 'Single element in sorted array', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-10',
        topic: 'Binary Search',
        sectionTitle: 'On answers',
        startDate: '2026-09-14',
        endDate: '2026-09-20',
        subsections: [
          {
            id: 'dsa-10-sub-1',
            title: 'Binary Search on Answers',
            questions: [
              { id: 'q-dsa-53', title: 'Find square root of a number', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-54', title: 'Find Nth root of a number', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-55', title: 'Find the smallest divisor', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-56', title: 'Koko eating bananas', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-57', title: 'Minimum days to make M bouquets', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-11',
        topic: 'Binary Search',
        sectionTitle: 'FAQs',
        startDate: '2026-09-14',
        endDate: '2026-09-20',
        subsections: [
          {
            id: 'dsa-11-sub-1',
            title: 'Hard BS Problems',
            questions: [
              { id: 'q-dsa-58', title: 'Aggressive Cows', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-59', title: 'Book Allocation Problem', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-60', title: 'Find peak element', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-61', title: 'Median of 2 sorted arrays', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-62', title: 'Kth element of 2 sorted arrays', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-63', title: 'Minimize Max Distance to Gas Station', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-64', title: 'Split array - largest sum', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-12',
        topic: 'Recursion',
        sectionTitle: 'Implementation Problems',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        subsections: [
          {
            id: 'dsa-12-sub-1',
            title: 'Implementation',
            questions: [
              { id: 'q-dsa-65', title: 'Pow(x,n)', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-66', title: 'Generate Parentheses', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-67', title: 'Power Set', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-13',
        topic: 'Recursion',
        sectionTitle: 'Subsequence Pattern Problems',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        subsections: [
          {
            id: 'dsa-13-sub-1',
            title: 'Subsequences',
            questions: [
              { id: 'q-dsa-68', title: 'Check if there exists a subsequence with sum K', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-69', title: 'Count all subsequences with sum K', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-14',
        topic: 'Recursion',
        sectionTitle: 'FAQs (Medium)',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        subsections: [
          {
            id: 'dsa-14-sub-1',
            title: 'Medium Recursion',
            questions: [
              { id: 'q-dsa-70', title: 'Combination Sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-71', title: 'Combination Sum II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-72', title: 'Subsets I', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-73', title: 'Subsets II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-74', title: 'Combination Sum III', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-15',
        topic: 'Recursion',
        sectionTitle: 'Hard',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        subsections: [
          {
            id: 'dsa-15-sub-1',
            title: 'Hard',
            questions: [
              { id: 'q-dsa-75', title: 'Letter Combinations of a Phone Number', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-16',
        topic: 'Recursion',
        sectionTitle: 'FAQs (Hard)',
        startDate: '2026-09-21',
        endDate: '2026-09-27',
        subsections: [
          {
            id: 'dsa-16-sub-1',
            title: 'Hard Backtracking',
            questions: [
              { id: 'q-dsa-76', title: 'Palindrome partitioning', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-77', title: 'Word Search', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-78', title: 'N Queen', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-79', title: 'Rat in a Maze', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-80', title: 'M Coloring Problem', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-81', title: 'Sudoku Solver', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-17',
        topic: 'Linked-List',
        sectionTitle: 'Fundamentals (Single LL)',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-17-sub-1',
            title: 'Singly LinkedList Basics',
            questions: [
              { id: 'q-dsa-82', title: 'Introduction to Singly LinkedList', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-83', title: 'Traversal in Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-84', title: 'Deletion in Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-85', title: 'Insertion in Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-86', title: 'Deletion of the head of LL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-87', title: 'Deletion of the tail of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-88', title: 'Deletion of the Kth element of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-89', title: 'Delete the element with value X', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-90', title: 'Insertion at the head of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-91', title: 'Insertion at the tail of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-92', title: 'Insertion at the Kth position of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-93', title: 'Insertion before the value X in Linked List', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-18',
        topic: 'Linked-List',
        sectionTitle: 'Fundamentals (Doubly LL)',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-18-sub-1',
            title: 'Doubly LinkedList Basics',
            questions: [
              { id: 'q-dsa-94', title: 'Introduction to Doubly LL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-95', title: 'Deletion in Doubly LL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-96', title: 'Insertion in DLL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-97', title: 'Convert Array to Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-98', title: 'Delete head of Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-99', title: 'Delete Tail of Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-100', title: 'Delete Kth Element of Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-101', title: 'Removing given node in Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-102', title: 'Insert node before head in Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-103', title: 'Insert node before tail in Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-104', title: 'Insert node before (kth node) in Doubly Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-105', title: 'Insert before given node in Doubly Linked List', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-19',
        topic: 'Linked-List',
        sectionTitle: 'Logic Building',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-19-sub-1',
            title: 'Logic Building',
            questions: [
              { id: 'q-dsa-106', title: 'Add two numbers in Linked List', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-107', title: 'Segregate odd and even nodes in Linked List', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-108', title: "Sort a Linked List of 0's 1's and 2's", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-109', title: 'Remove Nth node from the back of the LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-110', title: 'Reverse a LL', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-20',
        topic: 'Linked-List',
        sectionTitle: 'FAQs (Medium)',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-20-sub-1',
            title: 'Medium FAQs',
            questions: [
              { id: 'q-dsa-111', title: 'Add one to a number represented by LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-112', title: 'Find Middle of Linked List', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-113', title: 'Delete the middle node in LL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-114', title: 'Check if LL is palindrome or not', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-115', title: 'Find the intersection point of Y LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-116', title: 'Detect a loop in LL', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-117', title: 'Find the starting point in LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-118', title: 'Length of loop in LL', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-21',
        topic: 'Linked-List',
        sectionTitle: 'FAQs (Hard)',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-21-sub-1',
            title: 'Hard Linked-List',
            questions: [
              { id: 'q-dsa-119', title: 'Reverse LL in group of given size K', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-120', title: 'Rotate a LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-121', title: 'Merge two Sorted Lists', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-122', title: 'Flattening of LL', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-123', title: 'Sort LL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-124', title: 'Clone a LL with random and next pointer', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-22',
        topic: 'Linked-List',
        sectionTitle: 'FAQS (DLL)',
        startDate: '2026-09-28',
        endDate: '2026-10-05',
        subsections: [
          {
            id: 'dsa-22-sub-1',
            title: 'Doubly LL FAQs',
            questions: [
              { id: 'q-dsa-125', title: 'Delete all occurrences of a key in DLL', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-126', title: 'Remove duplicates from sorted DLL', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-23',
        topic: 'Greedy Algorithms',
        sectionTitle: 'Easy',
        startDate: '2026-10-06',
        endDate: '2026-10-10',
        subsections: [
          {
            id: 'dsa-23-sub-1',
            title: 'Easy Greedy',
            questions: [
              { id: 'q-dsa-127', title: 'Assign Cookies', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-128', title: 'Lemonade Change', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-129', title: 'Jump Game - I', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-24',
        topic: 'Greedy Algorithms',
        sectionTitle: 'Scheduling and Interval Problems',
        startDate: '2026-10-06',
        endDate: '2026-10-10',
        subsections: [
          {
            id: 'dsa-24-sub-1',
            title: 'Scheduling',
            questions: [
              { id: 'q-dsa-130', title: 'Shortest Job First', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-131', title: 'Job sequencing Problem', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-132', title: 'N meetings in one room', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-133', title: 'Non-overlapping Intervals', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-134', title: 'Insert Interval', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-135', title: 'Minimum number of platforms required for a railway', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-25',
        topic: 'Greedy Algorithms',
        sectionTitle: 'Hard',
        startDate: '2026-10-06',
        endDate: '2026-10-10',
        subsections: [
          {
            id: 'dsa-25-sub-1',
            title: 'Hard Greedy',
            questions: [
              { id: 'q-dsa-136', title: 'Valid Paranthesis Checker', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-137', title: 'Candy', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-26',
        topic: 'Sliding Window / 2 Pointer',
        sectionTitle: 'Pattern and Template',
        startDate: '2026-10-11',
        endDate: '2026-10-16',
        subsections: [
          {
            id: 'dsa-26-sub-1',
            title: 'Pattern & Template',
            questions: [
              { id: 'q-dsa-138', title: 'Theory', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-27',
        topic: 'Sliding Window / 2 Pointer',
        sectionTitle: 'Constant Window',
        startDate: '2026-10-11',
        endDate: '2026-10-16',
        subsections: [
          {
            id: 'dsa-27-sub-1',
            title: 'Constant Window',
            questions: [
              { id: 'q-dsa-139', title: 'Maximum Points You Can Obtain from Cards', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-28',
        topic: 'Sliding Window / 2 Pointer',
        sectionTitle: 'Longest and Smallest Window Problems',
        startDate: '2026-10-11',
        endDate: '2026-10-16',
        subsections: [
          {
            id: 'dsa-28-sub-1',
            title: 'Variable Window',
            questions: [
              { id: 'q-dsa-140', title: 'Longest Substring Without Repeating Characters', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-141', title: 'Max Consecutive Ones III', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-142', title: 'Fruit Into Baskets', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-143', title: 'Longest Substring With At Most K Distinct Characters', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-144', title: 'Longest Repeating Character Replacement', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-145', title: 'Minimum Window Substring', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-29',
        topic: 'Sliding Window / 2 Pointer',
        sectionTitle: 'Counting Subarrays / Substrings Problems',
        startDate: '2026-10-11',
        endDate: '2026-10-16',
        subsections: [
          {
            id: 'dsa-29-sub-1',
            title: 'Counting Subarrays',
            questions: [
              { id: 'q-dsa-146', title: 'Number of Substrings Containing All Three Characters', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-147', title: 'Binary Subarrays With Sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-148', title: 'Count number of Nice subarrays', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-30',
        topic: 'Stack / Queues',
        sectionTitle: 'Implementation',
        startDate: '2026-10-17',
        endDate: '2026-10-21',
        subsections: [
          {
            id: 'dsa-30-sub-1',
            title: 'Implementation',
            questions: [
              { id: 'q-dsa-149', title: 'Implementation using different DS', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-150', title: 'Implement Stack using Arrays', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-151', title: 'Implement Queue using Arrays', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-152', title: 'Implement Stack using Queue', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-153', title: 'Implement Queue using Stack', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-154', title: 'Implement stack using Linkedlist', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-155', title: 'Implement queue using Linkedlist', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-156', title: 'Balanced Paranthesis', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-31',
        topic: 'Stack / Queues',
        sectionTitle: 'Monotonic Stack',
        startDate: '2026-10-17',
        endDate: '2026-10-21',
        subsections: [
          {
            id: 'dsa-31-sub-1',
            title: 'Monotonic Stack',
            questions: [
              { id: 'q-dsa-157', title: 'Next Greater Element', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-158', title: 'Next Greater Element - 2', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-159', title: 'Asteroid Collision', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-160', title: 'Sum of Subarray Minimums', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-161', title: 'Sum of Subarray Ranges', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-162', title: 'Remove K Digits', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-32',
        topic: 'Stack / Queues',
        sectionTitle: 'FAQs',
        startDate: '2026-10-17',
        endDate: '2026-10-21',
        subsections: [
          {
            id: 'dsa-32-sub-1',
            title: 'Stack & Queue FAQs',
            questions: [
              { id: 'q-dsa-163', title: 'Implement Min Stack', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-164', title: 'Sliding Window Maximum', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-165', title: 'Trapping Rainwater', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-166', title: 'Largest rectangle in a histogram', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-167', title: 'Maximum Rectangles', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-168', title: 'Stock span problem', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-169', title: 'Celebrity Problem', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-170', title: 'LRU Cache', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-171', title: 'LFU Cache', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-33',
        topic: 'Binary Trees',
        sectionTitle: 'Theory/Traversals',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        subsections: [
          {
            id: 'dsa-33-sub-1',
            title: 'Traversals',
            questions: [
              { id: 'q-dsa-172', title: 'Introduction', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-173', title: 'Inorder Traversal', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-174', title: 'Preorder Traversal', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-175', title: 'Postorder Traversal', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-176', title: 'Level Order Traversal', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-177', title: 'Pre, Post, Inorder in one traversal', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-34',
        topic: 'Binary Trees',
        sectionTitle: 'Medium Problems',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        subsections: [
          {
            id: 'dsa-34-sub-1',
            title: 'Medium Problems',
            questions: [
              { id: 'q-dsa-178', title: 'Maximum Depth in BT', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-179', title: 'Check if two trees are identical or not', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-180', title: 'Check for balanced binary tree', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-181', title: 'Diameter of Binary Tree', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-182', title: 'Maximum path sum', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-183', title: 'Check for symmetrical BTs', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-35',
        topic: 'Binary Trees',
        sectionTitle: 'FAQs',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        subsections: [
          {
            id: 'dsa-35-sub-1',
            title: 'Binary Tree Views & Paths',
            questions: [
              { id: 'q-dsa-184', title: 'Zig Zag or Spiral Traversal', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-185', title: 'Boundary Traversal', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-186', title: 'Vertical Order Traversal', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-187', title: 'Top View of BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-188', title: 'Bottom view of BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-189', title: 'Right/Left View of BT', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-190', title: 'Print root to leaf path in BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-191', title: 'LCA in BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-192', title: 'Maximum Width of BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-193', title: 'Print all nodes at a distance of K in BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-194', title: 'Minimum time taken to burn the BT from a given Node', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-195', title: 'Count total nodes in a complete BT', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-36',
        topic: 'Binary Trees',
        sectionTitle: 'Construction Problems',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        subsections: [
          {
            id: 'dsa-36-sub-1',
            title: 'Tree Construction',
            questions: [
              { id: 'q-dsa-196', title: 'Requirements needed to construct a unique BT', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-197', title: 'Construct a BT from Preorder and Inorder', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-198', title: 'Construct a BT from Postorder and Inorder', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-199', title: 'Serialize and De-serialize BT', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-37',
        topic: 'Binary Trees',
        sectionTitle: 'Traversal in Constant Space',
        startDate: '2026-10-22',
        endDate: '2026-10-28',
        subsections: [
          {
            id: 'dsa-37-sub-1',
            title: 'Morris Traversal',
            questions: [
              { id: 'q-dsa-200', title: 'Morris Inorder Traversal', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-201', title: 'Morris Preorder Traversal', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-38',
        topic: 'Binary Search Trees',
        sectionTitle: 'Theory and Basics',
        startDate: '2026-10-29',
        endDate: '2026-11-02',
        subsections: [
          {
            id: 'dsa-38-sub-1',
            title: 'BST Basics',
            questions: [
              { id: 'q-dsa-202', title: 'Introduction to BST', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-203', title: 'Search in BST', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-204', title: 'Floor and Ceil in a BST', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-39',
        topic: 'Binary Search Trees',
        sectionTitle: 'Medium',
        startDate: '2026-10-29',
        endDate: '2026-11-02',
        subsections: [
          {
            id: 'dsa-39-sub-1',
            title: 'BST Operations',
            questions: [
              { id: 'q-dsa-205', title: 'Insert a given node in BST', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-206', title: 'Delete a node in BST', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-207', title: 'Kth Smallest and Largest element in BST', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-208', title: 'Check if a tree is a BST or not', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-209', title: 'LCA in BST', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-210', title: 'Construct a BST from a preorder traversal', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-211', title: 'Inorder successor and predecessor in BST', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-40',
        topic: 'Binary Search Trees',
        sectionTitle: 'FAQs',
        startDate: '2026-10-29',
        endDate: '2026-11-02',
        subsections: [
          {
            id: 'dsa-40-sub-1',
            title: 'BST FAQs',
            questions: [
              { id: 'q-dsa-212', title: 'BST iterator', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-213', title: 'Two sum in BST', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-214', title: 'Correct BST with two nodes swapped', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-215', title: 'Largest BST in Binary Tree', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-41',
        topic: 'Heaps',
        sectionTitle: 'Theory and Implementation',
        startDate: '2026-11-03',
        endDate: '2026-11-06',
        subsections: [
          {
            id: 'dsa-41-sub-1',
            title: 'Heap Basics',
            questions: [
              { id: 'q-dsa-216', title: 'Heaps (Theory Video)', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-217', title: 'Heapify Algorithm', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-218', title: 'Build heap from a given Array', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-219', title: 'Implement Min Heap', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-220', title: 'Implement Max Heap', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-221', title: 'Check if an array represents a min heap', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-222', title: 'Convert Min Heap to Max Heap', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-223', title: 'Heap Sort', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-224', title: 'K-th Largest element in an array', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-42',
        topic: 'Heaps',
        sectionTitle: 'FAQs',
        startDate: '2026-11-03',
        endDate: '2026-11-06',
        subsections: [
          {
            id: 'dsa-42-sub-1',
            title: 'Heap Streaming',
            questions: [
              { id: 'q-dsa-225', title: 'Kth largest element in a stream of running integers', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-43',
        topic: 'Graphs',
        sectionTitle: 'Theory and traversals',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-43-sub-1',
            title: 'Graph Fundamentals',
            questions: [
              { id: 'q-dsa-226', title: 'Introduction to Graph', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-227', title: 'Traversal Techniques (BFS & DFS)', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-228', title: 'Connected Components', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-44',
        topic: 'Graphs',
        sectionTitle: 'Traversal Problems',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-44-sub-1',
            title: 'Traversal Applications',
            questions: [
              { id: 'q-dsa-229', title: 'Number of provinces', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-230', title: 'Number of islands', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-231', title: 'Flood fill algorithm', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-232', title: 'Number of enclaves', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-233', title: 'Rotten Oranges', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-234', title: 'Distance of nearest cell having one', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-235', title: 'Surrounded Regions', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-236', title: 'Number of distinct islands', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-45',
        topic: 'Graphs',
        sectionTitle: 'Cycles',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-45-sub-1',
            title: 'Cycle Detection & Topo Sort',
            questions: [
              { id: 'q-dsa-237', title: 'Detect a cycle in an undirected graph', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-238', title: 'Bipartite graph', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-239', title: "Topological sort or Kahn's algorithm", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-240', title: 'Detect a cycle in a directed graph', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-46',
        topic: 'Graphs',
        sectionTitle: 'Hard Problems',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-46-sub-1',
            title: 'Hard Graph Problems',
            questions: [
              { id: 'q-dsa-241', title: 'Find eventual safe states', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-242', title: 'Course Schedule I', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-243', title: 'Course Schedule II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-244', title: 'Alien Dictionary', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-245', title: 'Shortest path in DAG', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-246', title: 'Shortest path in undirected graph with unit weights', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-247', title: 'Word ladder I', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-248', title: 'Word ladder II', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-47',
        topic: 'Graphs',
        sectionTitle: 'Shortest Path Algorithms',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-47-sub-1',
            title: 'Shortest Path',
            questions: [
              { id: 'q-dsa-249', title: "Dijkstra's algorithm", completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-250', title: 'Print Shortest Path', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-251', title: 'Shortest Distance in a Binary Maze', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-252', title: 'Path with minimum effort', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-253', title: 'Cheapest flight within K stops', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-254', title: 'Minimum multiplications to reach end', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-255', title: 'Number of ways to arrive at destination', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-256', title: 'Bellman ford algorithm', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-257', title: 'Floyd warshall algorithm', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-258', title: 'Find the city with the smallest number of neighbors', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-48',
        topic: 'Graphs',
        sectionTitle: 'Minimum Spanning Tree',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-48-sub-1',
            title: 'MST & Disjoint Set',
            questions: [
              { id: 'q-dsa-259', title: 'MST theory (Prim & Kruskal)', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-260', title: 'Disjoint Set (Union Find)', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-261', title: 'Find the MST weight', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-49',
        topic: 'Graphs',
        sectionTitle: 'Hard Problems II',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-49-sub-1',
            title: 'Disjoint Set Applications',
            questions: [
              { id: 'q-dsa-262', title: 'Number of operations to make network connected', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-263', title: 'Accounts merge', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-264', title: 'Number of islands II', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-265', title: 'Making a large island', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-266', title: 'Most stones removed with same row or column', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-50',
        topic: 'Graphs',
        sectionTitle: 'Additional Algorithms',
        startDate: '2026-11-07',
        endDate: '2026-11-20',
        subsections: [
          {
            id: 'dsa-50-sub-1',
            title: 'Advanced Graph Theory',
            questions: [
              { id: 'q-dsa-267', title: "Kosaraju's algorithm (Strongly Connected Components)", completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-268', title: 'Bridges in graph (Tarjan)', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-269', title: 'Articulation point in graph', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-51',
        topic: 'Dynamic Programming',
        sectionTitle: 'Introduction',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-51-sub-1',
            title: 'Introduction',
            questions: [
              { id: 'q-dsa-270', title: 'Introduction to DP (Memoization & Tabulation)', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'dsa-52',
        topic: 'Dynamic Programming',
        sectionTitle: '1D DP',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-52-sub-1',
            title: '1D DP',
            questions: [
              { id: 'q-dsa-271', title: 'Climbing stairs', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-272', title: 'Frog Jump', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-273', title: 'Frog jump with K distances', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-274', title: 'Maximum sum of non adjacent elements', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-275', title: 'House robber', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-53',
        topic: 'Dynamic Programming',
        sectionTitle: '2D DP',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-53-sub-1',
            title: '2D DP',
            questions: [
              { id: 'q-dsa-276', title: "Ninja's training", completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-54',
        topic: 'Dynamic Programming',
        sectionTitle: 'DP on grids',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-54-sub-1',
            title: 'Grid DP',
            questions: [
              { id: 'q-dsa-277', title: 'Grid unique paths', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-278', title: 'Unique paths II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-279', title: 'Minimum Falling Path Sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-280', title: 'Triangle', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-281', title: 'Cherry pickup II', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-55',
        topic: 'Dynamic Programming',
        sectionTitle: 'DP on stocks',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-55-sub-1',
            title: 'Stock DP',
            questions: [
              { id: 'q-dsa-282', title: 'Best time to buy and sell stock', completed: false, difficulty: 'Easy' },
              { id: 'q-dsa-283', title: 'Best time to buy and sell stock II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-284', title: 'Best time to buy and sell stock III', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-285', title: 'Best time to buy and sell stock IV', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-286', title: 'Best time to buy and sell stock with transaction fees', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-56',
        topic: 'Dynamic Programming',
        sectionTitle: 'DP on subsequences',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-56-sub-1',
            title: 'Knapsack & Subsequences',
            questions: [
              { id: 'q-dsa-287', title: 'Subset sum equals to target', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-288', title: 'Partition equal subset sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-289', title: 'Partition a set into two subsets with minimum absolute sum difference', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-290', title: 'Count subsets with sum K', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-291', title: 'Count partitions with given difference', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-292', title: '0 and 1 Knapsack', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-293', title: 'Minimum coins', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-294', title: 'Target sum', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-295', title: 'Coin change II', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-296', title: 'Unbounded knapsack', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-297', title: 'Rod cutting problem', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-57',
        topic: 'Dynamic Programming',
        sectionTitle: 'LIS',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-57-sub-1',
            title: 'Longest Increasing Subsequence',
            questions: [
              { id: 'q-dsa-298', title: 'Longest Increasing Subsequence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-299', title: 'Print Longest Increasing Subsequence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-300', title: 'Largest Divisible Subset', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-301', title: 'Longest String Chain', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-302', title: 'Longest Bitonic Subsequence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-303', title: 'Number of Longest Increasing Subsequences', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'dsa-58',
        topic: 'Dynamic Programming',
        sectionTitle: 'DP on strings',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-58-sub-1',
            title: 'String DP',
            questions: [
              { id: 'q-dsa-304', title: 'Longest common subsequence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-305', title: 'Longest common substring', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-306', title: 'Longest palindromic subsequence', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-307', title: 'Minimum insertions to make string palindrome', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-308', title: 'Minimum insertions or deletions to convert string A to B', completed: false, difficulty: 'Medium' },
              { id: 'q-dsa-309', title: 'Shortest common supersequence', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-310', title: 'Distinct subsequences', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-311', title: 'Edit distance', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-312', title: 'Wildcard matching', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'dsa-59',
        topic: 'Dynamic Programming',
        sectionTitle: 'MCM DP',
        startDate: '2026-11-21',
        endDate: '2026-12-01',
        subsections: [
          {
            id: 'dsa-59-sub-1',
            title: 'Matrix Chain Multiplication',
            questions: [
              { id: 'q-dsa-313', title: 'Matrix chain multiplication', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-314', title: 'Minimum cost to cut the stick', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-315', title: 'Burst balloons', completed: false, difficulty: 'Hard' },
              { id: 'q-dsa-316', title: 'Palindrome partitioning II', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lld',
    title: 'LLD Track',
    description: 'Low Level Design & Object-Oriented Design Timetable',
    sections: [
      {
        id: 'lld-1',
        sectionTitle: 'Introduction to LLD',
        startDate: '2026-09-04',
        endDate: '2026-09-07',
        subsections: [
          {
            id: 'lld-1-sub-1',
            title: 'LLD Fundamentals',
            questions: [
              { id: 'q-lld-1', title: 'Introduction to Low Level Design', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-2', title: 'Software Design Principles', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'lld-2',
        sectionTitle: 'Solid Principles',
        startDate: '2026-09-08',
        endDate: '2026-09-13',
        subsections: [
          {
            id: 'lld-2-sub-1',
            title: 'SOLID Principles Breakdown',
            questions: [
              { id: 'q-lld-3', title: 'Single Responsibility Principle (SRP)', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-4', title: 'Open Closed Principle (OCP)', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-5', title: 'Liskov Substitution Principle (LSP)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-6', title: 'Interface Segregation Principle (ISP)', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-7', title: 'Dependency Inversion Principle (DIP)', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-3',
        sectionTitle: 'UML',
        startDate: '2026-09-14',
        endDate: '2026-09-16',
        subsections: [
          {
            id: 'lld-3-sub-1',
            title: 'UML Diagrams',
            questions: [
              { id: 'q-lld-8', title: 'Unified Modeling Language (UML)', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-9', title: 'Class UML diagrams', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'lld-4',
        sectionTitle: 'Creational Design Patterns',
        startDate: '2026-09-17',
        endDate: '2026-09-23',
        subsections: [
          {
            id: 'lld-4-sub-1',
            title: 'Creational Patterns',
            questions: [
              { id: 'q-lld-10', title: 'Introduction to Design Patterns', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-11', title: 'Singleton Design Pattern', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-12', title: 'Factory Method', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-13', title: 'Builder Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-14', title: 'Abstract Factory', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-15', title: 'Prototype Pattern', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-5',
        sectionTitle: 'Structural Design Patterns',
        startDate: '2026-09-24',
        endDate: '2026-10-08',
        subsections: [
          {
            id: 'lld-5-sub-1',
            title: 'Structural Patterns',
            questions: [
              { id: 'q-lld-16', title: 'Adapter Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-17', title: 'Decorator Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-18', title: 'Facade Pattern', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-19', title: 'Composite Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-20', title: 'Proxy Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-21', title: 'Bridge Pattern', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-22', title: 'Flyweight Pattern', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'lld-6',
        sectionTitle: 'Behavioural Design Patterns',
        startDate: '2026-10-09',
        endDate: '2026-10-18',
        subsections: [
          {
            id: 'lld-6-sub-1',
            title: 'Behavioural Patterns',
            questions: [
              { id: 'q-lld-23', title: 'Iterator Pattern', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-24', title: 'Observer Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-25', title: 'Strategy Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-26', title: 'Command Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-27', title: 'Template Method', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-28', title: 'State Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-29', title: 'Chain of Responsibility', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-30', title: 'Visitor Pattern', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-31', title: 'Mediator Pattern', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-32', title: 'Memento Pattern', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'lld-7',
        sectionTitle: 'Multithreading and Concurrency',
        startDate: '2026-10-19',
        endDate: '2026-10-23',
        subsections: [
          {
            id: 'lld-7-sub-1',
            title: 'Concurrency Concepts',
            questions: [
              { id: 'q-lld-33', title: 'Multithreading and Concurrency', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-34', title: 'Creating and Managing Threads', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-35', title: 'Thread Pools and Executors', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-36', title: 'Thread Safety and Synchronization', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-37', title: 'Locks and Synchronization Mechanism', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-38', title: 'Deadlock and Prevention Techniques', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-39', title: 'Producer Consumer Problem', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
      {
        id: 'lld-8',
        sectionTitle: 'Dependency Injection',
        startDate: '2026-10-24',
        endDate: '2026-10-26',
        subsections: [
          {
            id: 'lld-8-sub-1',
            title: 'Dependency Injection Frameworks',
            questions: [
              { id: 'q-lld-40', title: 'Dependency Injection', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-9',
        sectionTitle: 'Exceptions and Error Handling',
        startDate: '2026-10-27',
        endDate: '2026-10-30',
        subsections: [
          {
            id: 'lld-9-sub-1',
            title: 'Resilient Systems',
            questions: [
              { id: 'q-lld-41', title: 'Exception Handling (LLD)', completed: false, difficulty: 'Easy' },
              { id: 'q-lld-42', title: 'Building Resilient Systems', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-10',
        sectionTitle: 'Best practices in LLD',
        startDate: '2026-10-31',
        endDate: '2026-11-06',
        subsections: [
          {
            id: 'lld-10-sub-1',
            title: 'Best Practices',
            questions: [
              { id: 'q-lld-43', title: "All About API's", completed: false, difficulty: 'Easy' },
              { id: 'q-lld-44', title: 'Database Design and Integration', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-45', title: 'How to approach a LLD Interview', completed: false, difficulty: 'Easy' },
            ],
          },
        ],
      },
      {
        id: 'lld-11',
        sectionTitle: 'Interview Problems (Part-1)',
        startDate: '2026-11-07',
        endDate: '2026-11-16',
        subsections: [
          {
            id: 'lld-11-sub-1',
            title: 'Machine Coding Problems 1',
            questions: [
              { id: 'q-lld-46', title: 'Parking Lot (Design)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-47', title: 'Parking Lot (Code)', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-48', title: 'Logging Framework (Design)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-49', title: 'Logging Framework (Code)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-50', title: 'Traffic Signal System (Design)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-51', title: 'Traffic Signal System (Code)', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-52', title: 'Vending Machine Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-53', title: 'Vending Machine Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-54', title: 'Task Management System Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-55', title: 'Task Management System Code', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-12',
        sectionTitle: 'Interview Problems (Part-2)',
        startDate: '2026-11-17',
        endDate: '2026-11-22',
        subsections: [
          {
            id: 'lld-12-sub-1',
            title: 'Machine Coding Problems 2',
            questions: [
              { id: 'q-lld-56', title: 'PubSub System Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-57', title: 'PubSub System Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-58', title: 'ATM Machine Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-59', title: 'ATM Machine Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-60', title: 'Hotel Management System Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-61', title: 'Hotel Management System Code', completed: false, difficulty: 'Medium' },
            ],
          },
        ],
      },
      {
        id: 'lld-13',
        sectionTitle: 'Interview Problems (Part-3)',
        startDate: '2026-11-23',
        endDate: '2026-12-02',
        subsections: [
          {
            id: 'lld-13-sub-1',
            title: 'Machine Coding Problems 3',
            questions: [
              { id: 'q-lld-62', title: 'Elevator System Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-63', title: 'Elevator System Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-64', title: 'Digital Wallet Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-65', title: 'Types of Locking Mechanism', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-66', title: 'Digital Wallet Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-67', title: 'Ride Booking App Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-68', title: 'Ride Booking App Code', completed: false, difficulty: 'Hard' },
              { id: 'q-lld-69', title: 'Music Streaming Platform Design', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-70', title: 'Streaming Protocols', completed: false, difficulty: 'Medium' },
              { id: 'q-lld-71', title: 'Music Streaming Platform Code', completed: false, difficulty: 'Hard' },
            ],
          },
        ],
      },
    ],
  },
];

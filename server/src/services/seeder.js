const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const { Module, Lesson } = require('../models/Curriculum');
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const CodingProblem = require('../models/CodingProblem');
const Company = require('../models/Company');
const Certificate = require('../models/Certificate');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping full re-seeding.');
      return;
    }

    console.log('Seeding DreamLearn database with comprehensive initial data...');

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const studentPasswordHash = await bcrypt.hash('Student@123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@dreamlearn.edu',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    // 2. Create Student
    const student = await User.create({
      name: 'Hari Selvam',
      email: 'student@dreamlearn.edu',
      passwordHash: studentPasswordHash,
      role: 'student',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      college: 'National Institute of Technology',
      graduationYear: 2026,
      targetCompany: 'Google',
      streak: {
        current: 7,
        longest: 14,
        lastActiveDate: new Date(),
      },
      placementReadiness: {
        score: 82,
        solvedCount: 104,
        assessmentsCompleted: 8,
      },
    });

    console.log('Default accounts created:');
    console.log('  Admin:   admin@dreamlearn.edu / Admin@123');
    console.log('  Student: student@dreamlearn.edu / Student@123');

    // 3. Create Courses
    const course1 = await Course.create({
      title: 'Data Structures & Algorithms in C++',
      slug: 'data-structures-and-algorithms-cpp',
      shortDescription: 'Master core DSA concepts and problem solving for Tier-1 company tech rounds.',
      description: 'Comprehensive, placement-focused course covering Big O notation, Arrays, Strings, Linked Lists, Stacks, Queues, Binary Trees, BSTs, Heaps, Graphs, and Dynamic Programming with 200+ solved interview problems.',
      category: 'Data Structures',
      topic: 'C++ & DSA',
      difficulty: 'Beginner to Advanced',
      duration: '12 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
      pdfNotes: [
        {
          title: 'DSA Comprehensive Formula & Complexity Sheet',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Master reference for Big O notations, recursion relations, and tree heights.',
          fileSize: '2.1 MB',
        },
        {
          title: 'Binary Trees & Graphs Interview Blueprint Notes',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'In-depth notes covering BFS, DFS, Dijkstra, Topo Sort, and Trie implementations.',
          fileSize: '4.5 MB',
        },
        {
          title: 'Top 75 FAANG LeetCode Solutions Handout',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Annotated solutions and space-time optimizations for classic technical interview problems.',
          fileSize: '3.8 MB',
        },
      ],
      learningOutcomes: [
        'Analyze time and space complexity with Big O notation',
        'Implement fundamental and advanced data structures from scratch',
        'Solve medium and hard LeetCode problems with optimal techniques',
        'Ace technical coding rounds of product-based companies',
      ],
      prerequisites: ['Basic knowledge of C++ or any programming language', 'High school mathematics'],
      instructor: {
        name: 'Prof. Raghav Sharma',
        title: 'Ex-Google Staff Engineer & Author',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Over 12 years of industry experience coaching thousands of software engineers.',
      },
      status: 'Published',
      enrolledCount: 3420,
      rating: 4.9,
      ratingCount: 840,
      featured: true,
    });

    const course2 = await Course.create({
      title: 'Modern Full-Stack Web Development',
      slug: 'modern-full-stack-web-development',
      shortDescription: 'Learn C, C++, Java, Python, JavaScript and full-stack web architectures.',
      description: 'Build enterprise-grade web applications from front to back using React, Node.js, Express, MongoDB, and Tailwind CSS. Covers REST APIs, JWT authentication, deployment, and cloud integration.',
      category: 'Programming Languages',
      topic: 'Full-Stack MERN',
      difficulty: 'Beginner to Advanced',
      duration: '10 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
      pdfNotes: [
        {
          title: 'Full-Stack MERN Architecture Guide (PDF)',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Component architecture, state management patterns, and REST API standards.',
          fileSize: '3.2 MB',
        },
        {
          title: 'Database Schema & Query Optimization Handout',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Mongoose indexing, MongoDB aggregation pipelines, and ACID transactions.',
          fileSize: '1.9 MB',
        },
      ],
      learningOutcomes: [
        'Build responsive, production-ready React web apps',
        'Design scalable Express.js backends and RESTful APIs',
        'Model data with MongoDB and Mongoose ODM',
        'Deploy modern web services to cloud environments',
      ],
      prerequisites: ['Basic HTML/CSS familiarity', 'Curiosity to build real products'],
      instructor: {
        name: 'Ananya Roy',
        title: 'Principal Architect at Microsoft',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Tech lead specializing in cloud systems and scalable web applications.',
      },
      status: 'Published',
      enrolledCount: 2850,
      rating: 4.8,
      ratingCount: 620,
      featured: true,
    });

    const course3 = await Course.create({
      title: 'Complete Placement & Aptitude Masterclass',
      slug: 'placement-preparation-masterclass',
      shortDescription: 'Quantitative aptitude, logical reasoning, technical & HR interview blueprints.',
      description: 'The definitive all-in-one guide to crack campus hiring: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Technical MCQs, Core CS revision, and behavioral HR interview frameworks (STAR method).',
      category: 'Placement Preparation',
      topic: 'Aptitude & Interviews',
      difficulty: 'Beginner to Advanced',
      duration: '8 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      learningOutcomes: [
        'Solve quantitative math problems in under 60 seconds with shortcut techniques',
        'Master puzzles, syllogisms, and deductive reasoning patterns',
        'Revise operating systems, DBMS, computer networks, and OOPs concepts',
        'Craft winning resumes and impress recruiters in HR rounds',
      ],
      prerequisites: ['Final or pre-final year college standing'],
      instructor: {
        name: 'Vikramaditya Verma',
        title: 'Director of Talent Acquisition',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'Conducted over 1,500 campus placement interviews across top tech employers.',
      },
      status: 'Published',
      enrolledCount: 4190,
      rating: 4.9,
      ratingCount: 1120,
      featured: true,
    });

    // 4. Create Modules and Lessons for Course 1
    const mod1 = await Module.create({
      courseId: course1._id,
      title: 'Module 1: Foundations of Algorithm Complexity',
      description: 'Asymptotic notation, Big-O, Big-Theta, Big-Omega, space complexity analysis.',
      order: 1,
      isPublished: true,
    });

    const lesson1_1 = await Lesson.create({
      courseId: course1._id,
      moduleId: mod1._id,
      title: '1.1 Introduction to Time & Space Complexity',
      description: 'Understanding why algorithmic efficiency matters in high-scale systems.',
      order: 1,
      contentType: 'article',
      contentText: `# Time and Space Complexity

In computer science, algorithmic efficiency is paramount. When processing billions of queries, the difference between $O(N)$ and $O(N^2)$ is the difference between milliseconds and days.

### Big O Notation Cheat Sheet
- **O(1) Constant**: Array indexing, basic arithmetic.
- **O(log N) Logarithmic**: Binary search, balanced tree lookups.
- **O(N) Linear**: Traversing an array or linked list.
- **O(N log N) Linearithmic**: Merge sort, Quick sort (average), Heap sort.
- **O(N^2) Quadratic**: Nested loops, Bubble sort.

\`\`\`cpp
// Example: O(1) vs O(N)
int getFirstElement(const vector<int>& arr) {
    return arr[0]; // O(1)
}

int sumElements(const vector<int>& arr) {
    int total = 0;
    for (int num : arr) { // O(N)
        total += num;
    }
    return total;
}
\`\`\`
`,
      codeSnippet: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {10, 20, 30, 40, 50};
    std::cout << "First element: " << nums[0] << std::endl;
    return 0;
}`,
      codeLanguage: 'cpp',
      durationMinutes: 20,
      isPreview: true,
      isPublished: true,
    });

    const lesson1_2 = await Lesson.create({
      courseId: course1._id,
      moduleId: mod1._id,
      title: '1.2 Two-Pointer Technique & Sliding Window',
      description: 'Master the two most frequently tested patterns in technical interviews.',
      order: 2,
      contentType: 'code',
      contentText: `### The Two-Pointer Pattern

Two pointers is an algorithmic paradigm where two references iterate through the data structure in tandem until one or both meet a specific condition.

Common use cases:
1. Reversing arrays in-place
2. Finding pairs with target sum in sorted arrays
3. Fast & Slow pointer (Floyd's cycle detection)
`,
      codeSnippet: `// Two-Sum in a Sorted Array
bool hasPairWithSum(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}`,
      codeLanguage: 'cpp',
      durationMinutes: 25,
      isPreview: false,
      isPublished: true,
    });

    const mod2 = await Module.create({
      courseId: course1._id,
      title: 'Module 2: Linked Lists & Pointers',
      description: 'Singly, doubly, and circular linked lists, cycle detection and reversal.',
      order: 2,
      isPublished: true,
    });

    const lesson2_1 = await Lesson.create({
      courseId: course1._id,
      moduleId: mod2._id,
      title: '2.1 Reversing a Linked List',
      description: 'Step-by-step iterative and recursive reversal of a singly linked list.',
      order: 1,
      contentType: 'article',
      contentText: `### Reversing a Singly Linked List

Reversing a linked list requires maintaining three pointers: \`prev\`, \`curr\`, and \`next\`.

\`\`\`cpp
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}
\`\`\`
`,
      durationMinutes: 30,
      isPreview: false,
      isPublished: true,
    });

    // 5. Enroll Student in Course 1 with 68% progress
    await Enrollment.create({
      studentId: student._id,
      courseId: course1._id,
      progressPercentage: 68,
      completedLessonsCount: 2,
      totalLessonsCount: 3,
      lastAccessedLessonId: lesson1_2._id,
      status: 'active',
    });

    await LessonProgress.create({
      studentId: student._id,
      courseId: course1._id,
      lessonId: lesson1_1._id,
      isCompleted: true,
    });

    await LessonProgress.create({
      studentId: student._id,
      courseId: course1._id,
      lessonId: lesson1_2._id,
      isCompleted: true,
    });

    // Enroll in Course 2 (42% progress)
    await Enrollment.create({
      studentId: student._id,
      courseId: course2._id,
      progressPercentage: 42,
      completedLessonsCount: 4,
      totalLessonsCount: 10,
      status: 'active',
    });

    // Enroll in Course 3 (28% progress)
    await Enrollment.create({
      studentId: student._id,
      courseId: course3._id,
      progressPercentage: 28,
      completedLessonsCount: 3,
      totalLessonsCount: 11,
      status: 'active',
    });

    // 6. Create Questions
    const q1 = await Question.create({
      text: 'What is the average time complexity of searching for an element in a Hash Table (with a good hash function)?',
      topic: 'Data Structures',
      difficulty: 'Easy',
      type: 'mcq',
      options: [
        { id: 'a', text: 'O(1)' },
        { id: 'b', text: 'O(log N)' },
        { id: 'c', text: 'O(N)' },
        { id: 'd', text: 'O(N log N)' },
      ],
      correctAnswerId: 'a',
      explanation: 'With a uniform hash function and low load factor, hash table lookups, insertions, and deletions take O(1) amortized time.',
      points: 2,
    });

    const q2 = await Question.create({
      text: 'Which data structure is primarily used to implement Breadth-First Search (BFS) in a Graph?',
      topic: 'Algorithms',
      difficulty: 'Easy',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Stack' },
        { id: 'b', text: 'Queue' },
        { id: 'c', text: 'Min Heap' },
        { id: 'd', text: 'Binary Search Tree' },
      ],
      correctAnswerId: 'b',
      explanation: 'BFS explores vertices level by level, utilizing a First-In-First-Out (FIFO) Queue.',
      points: 2,
    });

    const q3 = await Question.create({
      text: 'What is the worst-case time complexity of QuickSort?',
      topic: 'Algorithms',
      difficulty: 'Medium',
      type: 'mcq',
      options: [
        { id: 'a', text: 'O(N log N)' },
        { id: 'b', text: 'O(N)' },
        { id: 'c', text: 'O(N^2)' },
        { id: 'd', text: 'O(2^N)' },
      ],
      correctAnswerId: 'c',
      explanation: 'When the chosen pivot is consistently the smallest or largest element (e.g. sorted array without random pivot), QuickSort degrades to O(N^2).',
      points: 2,
    });

    const q4 = await Question.create({
      text: 'In a min-heap with N elements, what is the time complexity to extract the minimum element and restore heap property?',
      topic: 'Data Structures',
      difficulty: 'Medium',
      type: 'mcq',
      options: [
        { id: 'a', text: 'O(1)' },
        { id: 'b', text: 'O(log N)' },
        { id: 'c', text: 'O(N)' },
        { id: 'd', text: 'O(N log N)' },
      ],
      correctAnswerId: 'b',
      explanation: 'Extracting minimum involves swapping root with last element and sinking down (heapify), which takes O(log N) time.',
      points: 2,
    });

    const q5 = await Question.create({
      text: 'Which paradigm does the Floyd-Warshall algorithm use to solve all-pairs shortest paths?',
      topic: 'Algorithms',
      difficulty: 'Hard',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Greedy' },
        { id: 'b', text: 'Divide and Conquer' },
        { id: 'c', text: 'Dynamic Programming' },
        { id: 'd', text: 'Backtracking' },
      ],
      correctAnswerId: 'c',
      explanation: 'Floyd-Warshall iteratively updates pairwise distances via intermediate vertices using Dynamic Programming in O(V^3) time.',
      points: 2,
    });

    const q6_range = await Question.create({
      text: 'Calculate the total number of distinct simple undirected edges in a complete graph (K_n) with n = 10 vertices.',
      topic: 'Discrete Mathematics',
      difficulty: 'Easy',
      type: 'range',
      points: 3,
      rangeMin: 45,
      rangeMax: 45,
      exactAnswer: 45,
      tolerance: 0,
      explanation: 'For a complete graph with n vertices, the number of edges is n*(n-1)/2. For n=10, 10*9/2 = 45 edges.',
    });

    const q7_coding = await Question.create({
      text: 'Write a Python program that reads an integer N from standard input and prints the square of N (i.e., N * N). Solve in Python only.',
      topic: 'Algorithms',
      difficulty: 'Easy',
      type: 'coding',
      points: 5,
      allowedLanguages: ['python'],
      defaultLanguage: 'python',
      starterCode: `import sys

def main():
    line = sys.stdin.read().strip()
    if line:
        n = int(line)
        # Write your code to print square
        print(n * n)

if __name__ == '__main__':
    main()
`,
      testCases: [
        { input: '5', expectedOutput: '25', isHidden: false },
        { input: '12', expectedOutput: '144', isHidden: false },
        { input: '20', expectedOutput: '400', isHidden: true },
      ],
      explanation: 'Multiply the integer input with itself or compute n ** 2 and output to stdout.',
    });

    const q8_case = await Question.create({
      text: 'Based on the scenario description, which architectural pattern should the team adopt to prevent cascading failures across downstream payment providers?',
      topic: 'System Design',
      difficulty: 'Medium',
      type: 'case_based',
      scenarioTitle: 'Case Study: High-Volume Fintech Payment Gateway Outages',
      caseStudyText: 'FinPay processes 50,000 transactions per second. During Black Friday, an international banking gateway experienced intermittent 15-second timeouts. Because client threads remained blocked waiting for response headers, FinPay service worker pools became exhausted, crashing the entire checkout checkout cluster.',
      options: [
        { id: 'a', text: 'Circuit Breaker pattern with fallback queuing' },
        { id: 'b', text: 'Increase HTTP socket timeouts from 15s to 60s' },
        { id: 'c', text: 'Convert all synchronous database connections to raw TCP sockets' },
        { id: 'd', text: 'Disable SSL/TLS certificate verification' },
      ],
      correctAnswerId: 'a',
      explanation: 'The Circuit Breaker pattern trips upon repeated downstream timeouts, preventing thread starvation and cascading system crashes.',
      points: 4,
    });

    // 7. Create Assessments
    const dsaAssessment = await Assessment.create({
      title: 'DSA & Algorithms Placement Mock Test',
      slug: 'dsa-placement-mock-test',
      description: 'Comprehensive 5-question mock test simulating technical screening rounds at Tier-1 product companies.',
      category: 'DSA',
      difficulty: 'Intermediate',
      courseId: course1._id,
      durationMinutes: 20,
      passingScore: 60,
      attemptsAllowed: 3,
      status: 'Published',
      questions: [q1._id, q2._id, q3._id, q4._id, q5._id],
      totalQuestions: 5,
    });

    const coreCsAssessment = await Assessment.create({
      title: 'Core Computer Science Fundamentals (OS & DBMS)',
      slug: 'core-cs-fundamentals-os-dbms',
      description: 'Test your knowledge on deadlocks, memory management, ACID transactions, and indexing.',
      category: 'Core CS',
      difficulty: 'Beginner',
      durationMinutes: 15,
      passingScore: 70,
      attemptsAllowed: 3,
      status: 'Published',
      questions: [q1._id, q2._id, q3._id],
      totalQuestions: 3,
    });

    const advancedAssessment = await Assessment.create({
      title: 'Full-Stack & Systems Placement Assessment (Coursera Style)',
      slug: 'full-stack-systems-placement-assessment',
      description: 'Comprehensive assessment featuring Multiple Choice, Coursera Numerical Range, Restricted-Language Code Test (Python only), and Case Study questions.',
      category: 'Placement Mock',
      difficulty: 'Intermediate',
      durationMinutes: 25,
      passingScore: 60,
      attemptsAllowed: 5,
      status: 'Published',
      questions: [q1._id, q6_range._id, q7_coding._id, q8_case._id, q5._id],
      totalQuestions: 5,
    });

    // Seed previous completed attempt for Hari
    await AssessmentAttempt.create({
      studentId: student._id,
      assessmentId: dsaAssessment._id,
      answers: [
        { questionId: q1._id, selectedOptionId: 'a', isCorrect: true },
        { questionId: q2._id, selectedOptionId: 'b', isCorrect: true },
        { questionId: q3._id, selectedOptionId: 'c', isCorrect: true },
        { questionId: q4._id, selectedOptionId: 'b', isCorrect: true },
        { questionId: q5._id, selectedOptionId: 'a', isCorrect: false },
      ],
      score: 8,
      totalPoints: 10,
      percentage: 80,
      passed: true,
      correctCount: 4,
      totalQuestions: 5,
      timeSpentSeconds: 680,
      startedAt: new Date(Date.now() - 3600000 * 24),
      submittedAt: new Date(Date.now() - 3600000 * 24 + 680000),
      status: 'completed',
    });

    // 8. Create Coding Problems
    await CodingProblem.create({
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      category: 'Arrays',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0, 1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1, 2]',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
      ],
      starterCode: {
        python: `# Two Sum Solution
import sys

def two_sum():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    target = int(lines[1])
    nums = [int(x) for x in lines[2:2+n]]
    
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

two_sum()
`,
        cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (mp.count(diff)) {
            cout << mp[diff] << " " << i << endl;
            return 0;
        }
        mp[nums[i]] = i;
    }
    return 0;
}
`,
        c: `#include <stdio.h>

int main() {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int nums[1000];
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                return 0;
            }
        }
    }
    return 0;
}
`,
        java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
        javascript: `const fs = require('fs');

function main() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length < 2) return;
    const n = parseInt(input[0], 10);
    const target = parseInt(input[1], 10);
    const nums = input.slice(2, 2 + n).map(Number);

    const map = new Map();
    for (let i = 0; i < n; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            console.log(map.get(diff) + " " + i);
            return;
        }
        map.set(nums[i], i);
    }
}

main();
`,
      },
      testCases: [
        {
          input: '4 9\n2 7 11 15\n',
          expectedOutput: '0 1',
          isHidden: false,
        },
        {
          input: '3 6\n3 2 4\n',
          expectedOutput: '1 2',
          isHidden: false,
        },
        {
          input: '2 6\n3 3\n',
          expectedOutput: '0 1',
          isHidden: true,
        },
      ],
      acceptanceRate: 84.2,
      submissionsCount: 1540,
    });

    await CodingProblem.create({
      title: 'Valid Palindrome',
      slug: 'valid-palindrome',
      difficulty: 'Easy',
      category: 'Strings',
      description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Print \`true\` if it is a palindrome, or \`false\` otherwise.`,
      examples: [
        {
          input: 'race a car',
          output: 'false',
          explanation: '"raceacar" is not a palindrome.',
        },
      ],
      constraints: ['1 <= s.length <= 2 * 10^5'],
      starterCode: {
        python: `import sys

def is_palindrome():
    s = sys.stdin.read().strip()
    filtered = [c.lower() for c in s if c.isalnum()]
    print("true" if filtered == filtered[::-1] else "false")

is_palindrome()
`,
        cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    string clean = "";
    for (char c : s) {
        if (isalnum(c)) clean += tolower(c);
    }
    int l = 0, r = clean.length() - 1;
    bool pal = true;
    while (l < r) {
        if (clean[l++] != clean[r--]) {
            pal = false;
            break;
        }
    }
    cout << (pal ? "true" : "false") << endl;
    return 0;
}
`,
        javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const rev = clean.split('').reverse().join('');
console.log(clean === rev ? 'true' : 'false');
`,
      },
      testCases: [
        { input: 'race a car\n', expectedOutput: 'false', isHidden: false },
        { input: 'A man, a plan, a canal: Panama\n', expectedOutput: 'true', isHidden: false },
      ],
      acceptanceRate: 78.4,
      submissionsCount: 980,
    });

    // 9. Create Companies
    await Company.create({
      name: 'Google',
      slug: 'google',
      logo: 'https://www.google.com/favicon.ico',
      industry: 'Internet & Cloud Computing',
      description: 'Global leader in search, cloud, AI, and consumer hardware. Emphasizes clean code, optimal data structures, and system scalability.',
      hiringRoles: ['Software Engineer L3 (Campus)', 'Associate Product Manager', 'Data Scientist'],
      salaryRange: '₹28 - 45 LPA',
      difficulty: 'Very Hard',
      interviewRounds: [
        { roundNumber: 1, title: 'Online Coding Challenge', description: '2 Medium/Hard algorithmic questions on HackerEarth/Google Portal', duration: '60 mins' },
        { roundNumber: 2, title: 'Technical Interview I (DSA)', description: 'Problem solving on Trees, Graphs, or Dynamic Programming', duration: '45 mins' },
        { roundNumber: 3, title: 'Technical Interview II (System / OOPs)', description: 'Deep dive into algorithmic complexity and API design', duration: '45 mins' },
        { roundNumber: 4, title: 'Googleyness & Leadership', description: 'Behavioral, teamwork, and ethical decision scenarios', duration: '45 mins' },
      ],
      frequentlyAskedTopics: ['Dynamic Programming', 'Graph Traversal', 'Tries & Strings', 'Concurrency', 'System Scalability'],
      preparationResources: [
        { title: 'Google DSA Roadmap & Top 50 Problems', category: 'DSA', link: '/student/problems' },
        { title: 'Googleyness Interview Guide (STAR Technique)', category: 'HR', link: '/student/placement' },
      ],
      featured: true,
    });

    await Company.create({
      name: 'Microsoft',
      slug: 'microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      industry: 'Software & Cloud Services',
      description: 'Pioneer of Azure cloud, developer tools, and operating systems with rigorous technical evaluation.',
      hiringRoles: ['Software Development Engineer I', 'Cloud Solution Architect', 'Support Engineer'],
      salaryRange: '₹22 - 42 LPA',
      difficulty: 'Hard',
      interviewRounds: [
        { roundNumber: 1, title: 'Codility Online Assessment', description: '3 coding problems covering Arrays, Strings, and Bit Manipulation', duration: '90 mins' },
        { roundNumber: 2, title: 'Technical Round 1', description: 'Data structures, linked lists, and recursion', duration: '45 mins' },
        { roundNumber: 3, title: 'Technical Round 2', description: 'Trees, Graphs, and Low-Level Design (LLD)', duration: '45 mins' },
        { roundNumber: 4, title: 'AA (As Appropriate) Round', description: 'Partner Director interview on culture and vision', duration: '45 mins' },
      ],
      frequentlyAskedTopics: ['Binary Trees', 'Linked Lists', 'Bit Manipulation', 'Object-Oriented Design', 'Operating Systems'],
      preparationResources: [
        { title: 'Microsoft Interview Experience Archive', category: 'DSA', link: '/student/problems' },
      ],
      featured: true,
    });

    await Company.create({
      name: 'Amazon',
      slug: 'amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      industry: 'E-commerce & AWS Cloud',
      description: 'High-bar interview process combining rigorous data structures with the 16 Amazon Leadership Principles.',
      hiringRoles: ['Software Development Engineer I (SDE 1)', 'Data Engineer I'],
      salaryRange: '₹24 - 44 LPA',
      difficulty: 'Hard',
      interviewRounds: [
        { roundNumber: 1, title: 'OA1: Debugging & Coding', description: '2 coding problems + 7 code debugging exercises', duration: '90 mins' },
        { roundNumber: 2, title: 'OA2: Work Simulation & LP', description: 'Real-world workplace scenario assessment', duration: '60 mins' },
        { roundNumber: 3, title: 'Virtual Onsite 1 & 2', description: 'DSA + 2 Leadership Principles per round', duration: '60 mins' },
        { roundNumber: 4, title: 'Bar Raiser Round', description: 'Stress test problem solving and Customer Obsession alignment', duration: '60 mins' },
      ],
      frequentlyAskedTopics: ['BFS / DFS Graphs', 'Hash Maps', 'Heaps & Priority Queues', 'Customer Obsession (LP)', 'Bias for Action (LP)'],
      preparationResources: [
        { title: 'Amazon 16 Leadership Principles Playbook', category: 'HR', link: '/student/placement' },
      ],
      featured: true,
    });

    await Company.create({
      name: 'TCS (Tata Consultancy Services)',
      slug: 'tcs',
      logo: 'https://www.tcs.com/favicon.ico',
      industry: 'IT Services & Consulting',
      description: 'Largest tech employer hiring through TCS National Qualifier Test (NQT) for Prime and Digital cadres.',
      hiringRoles: ['TCS Prime (₹9 LPA)', 'TCS Digital (₹7.5 LPA)', 'TCS Ninja (₹3.6 LPA)'],
      salaryRange: '₹3.6 - 9 LPA',
      difficulty: 'Medium',
      interviewRounds: [
        { roundNumber: 1, title: 'TCS NQT Cognitive Test', description: 'Numerical Ability, Reasoning, Verbal', duration: '80 mins' },
        { roundNumber: 2, title: 'TCS NQT Advanced Coding', description: '2 coding questions in C, C++, Java, or Python', duration: '90 mins' },
        { roundNumber: 3, title: 'Technical, Managerial & HR Round', description: 'Combined interview on final year project, core CS, and aptitude', duration: '40 mins' },
      ],
      frequentlyAskedTopics: ['Quantitative Aptitude', 'Pointers & Memory', 'OOPs in Java/C++', 'SQL Queries', 'Final Year Project'],
      preparationResources: [
        { title: 'TCS NQT Previous Year Question Bank', category: 'Aptitude', link: '/student/assessments' },
      ],
      featured: true,
    });

    await Company.create({
      name: 'Infosys',
      slug: 'infosys',
      logo: 'https://www.infosys.com/favicon.ico',
      industry: 'IT Services & Consulting',
      description: 'Global IT consulting leader hiring engineering graduates through InfyTQ and HackWithInfy for specialist programmer tracks.',
      hiringRoles: ['Specialist Programmer (₹9.5 LPA)', 'Digital Specialist Engineer (₹6.5 LPA)', 'Systems Engineer (₹3.6 LPA)'],
      salaryRange: '₹3.6 - 9.5 LPA',
      difficulty: 'Medium',
      interviewRounds: [
        { roundNumber: 1, title: 'Online Assessment (HackWithInfy / InfyTQ)', description: 'Hands-on coding questions on Algorithms, Data Structures and DBMS', duration: '90 mins' },
        { roundNumber: 2, title: 'Technical Interview', description: 'Core programming concepts in Java/Python, database queries and projects', duration: '45 mins' },
        { roundNumber: 3, title: 'HR & Behavioral Interview', description: 'Communication skills, role adaptability, and academic background', duration: '30 mins' },
      ],
      frequentlyAskedTopics: ['Arrays & Strings', 'DBMS & SQL', 'Object-Oriented Programming', 'Dynamic Programming Basics', 'Data Structures'],
      preparationResources: [
        { title: 'Infosys InfyTQ & HackWithInfy Prep Guide', category: 'DSA', link: '/student/problems' },
      ],
      featured: true,
    });

    await Company.create({
      name: 'Deloitte',
      slug: 'deloitte',
      logo: 'https://www.deloitte.com/favicon.ico',
      industry: 'Management Consulting & Technology Services',
      description: 'One of the Big Four professional services firms hiring for technology consulting, cyber risk, analytics, and software advisory roles.',
      hiringRoles: ['Analyst - Technology Consulting (₹7.6 - 12 LPA)', 'Associate Analyst (₹4.5 - 6.5 LPA)', 'Cyber Security Analyst'],
      salaryRange: '₹4.5 - 12 LPA',
      difficulty: 'Medium',
      interviewRounds: [
        { roundNumber: 1, title: 'Aptitude & Versant Test', description: 'Quantitative, Logical, Verbal, and AI-evaluated spoken English communication', duration: '75 mins' },
        { roundNumber: 2, title: 'Technical Assessment', description: 'Data structures, SQL queries, cloud basics, and problem-solving', duration: '45 mins' },
        { roundNumber: 3, title: 'Partner / Director Interview', description: 'Consulting case study, behavioral questions, and business acumen', duration: '40 mins' },
      ],
      frequentlyAskedTopics: ['SQL & Relational Databases', 'Case Study & Problem Solving', 'Aptitude & Verbal Reasoning', 'Cloud Fundamentals', 'Data Structures Basics'],
      preparationResources: [
        { title: 'Deloitte Consulting Case & Aptitude Blueprint', category: 'Aptitude', link: '/student/assessments' },
      ],
      featured: true,
    });

    // 10. Create Certificate for Student
    await Certificate.create({
      certificateNumber: 'DL-2026-DSA-89412',
      studentId: student._id,
      studentName: 'Hari Selvam',
      courseId: course1._id,
      courseTitle: 'Data Structures & Algorithms in C++',
      issueDate: new Date('2026-09-15'),
      verificationCode: 'VERIFY-DL-89412-HS',
      grade: 'Distinction',
    });

    console.log('Database seeded successfully with all entities!');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
};

module.exports = { seedDatabase };

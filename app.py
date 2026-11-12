
import json
import os


class Student:
    def __init__(self, student_id, name, age, course, marks):
        self.student_id = student_id
        self.name = name
        self.age = age
        self.course = course
        self.marks = marks

    def calculate_total(self):
        return sum(self.marks.values())

    def calculate_percentage(self):
        return self.calculate_total() / len(self.marks)

    def calculate_grade(self):
        percentage = self.calculate_percentage()

        if percentage >= 90:
            return "A+"
        elif percentage >= 80:
            return "A"
        elif percentage >= 70:
            return "B"
        elif percentage >= 60:
            return "C"
        elif percentage >= 40:
            return "D"
        return "Fail"

    def to_dict(self):
        return {
            "student_id": self.student_id,
            "name": self.name,
            "age": self.age,
            "course": self.course,
            "marks": self.marks
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["student_id"],
            data["name"],
            data["age"],
            data["course"],
            data["marks"]
        )


class StudentManagementSystem:

    FILE_NAME = "students.json"

    def __init__(self):
        self.students = {}
        self.load_data()

    def load_data(self):
        if os.path.exists(self.FILE_NAME):
            try:
                with open(self.FILE_NAME, "r") as file:
                    data = json.load(file)

                for item in data:
                    student = Student.from_dict(item)
                    self.students[student.student_id] = student

                print("Student data loaded successfully.")

            except (json.JSONDecodeError, KeyError, TypeError):
                print("Unable to load student data.")

    def save_data(self):
        data = [
            student.to_dict()
            for student in self.students.values()
        ]

        with open(self.FILE_NAME, "w") as file:
            json.dump(data, file, indent=4)

    def add_student(self):

        try:
            student_id = input("Enter Student ID: ").strip()

            if not student_id:
                print("Student ID cannot be empty.")
                return

            if student_id in self.students:
                print("Student ID already exists.")
                return

            name = input("Enter Student Name: ").strip()
            if not name:
                print("Name cannot be empty.")
                return

            age = int(input("Enter Age: "))

            if age <= 0:
                print("Age must be positive.")
                return

            course = input("Enter Course: ").strip()

            subjects = ["Python", "SQL", "DSA", "Java", "Computer Networks"]

            marks = {}

            for subject in subjects:
                score = float(input(f"Enter {subject} Marks: "))

                if not 0 <= score <= 100:
                    print("Marks must be between 0 and 100.")
                    return

                marks[subject] = score

            student = Student(
                student_id,
                name,
                age,
                course,
                marks
            )

            self.students[student_id] = student
            self.save_data()

            print("Student added successfully!")

        except ValueError:
            print("Please enter valid numeric values.")

    def display_student(self, student):

        print("\n" + "=" * 50)
        print("STUDENT DETAILS")
        print("=" * 50)

        print("ID:", student.student_id)
        print("Name:", student.name)
        print("Age:", student.age)
        print("Course:", student.course)

        print("\nSubject Marks:")

        for subject, marks in student.marks.items():
            print(subject, ":", marks)

        print("\nTotal Marks:", student.calculate_total())
        print("Percentage:", student.calculate_percentage())
        print("Grade:", student.calculate_grade())

    def view_students(self):

        if not self.students:
            print("No student records available.")
            return

        for student in self.students.values():
            self.display_student(student)

    def search_student(self):

        student_id = input("Enter Student ID: ").strip()

        student = self.students.get(student_id)

        if student:
            self.display_student(student)
        else:
            print("Student not found.")

    def update_student(self):

        student_id = input("Enter Student ID: ").strip()

        student = self.students.get(student_id)

        if not student:
            print("Student not found.")
            return

        print("1. Update Name")
        print("2. Update Age")
        print("3. Update Course")
        print("4. Update Marks")

        choice = input("Enter your choice: ")

        try:
            if choice == "1":
                name = input("Enter new name: ").strip()
                if name:
                    student.name = name

            elif choice == "2":
                age = int(input("Enter new age: "))
                if age <= 0:
                    print("Age must be positive.")
                    return
                student.age = age

            elif choice == "3":
                course = input("Enter new course: ").strip()
                if course:
                    student.course = course

            elif choice == "4":
                subject = input("Enter subject name: ").strip()

                if subject not in student.marks:
                    print("Subject not found.")
                    return

                marks = float(input("Enter new marks: "))

                if not 0 <= marks <= 100:
                    print("Marks must be between 0 and 100.")
                    return

                student.marks[subject] = marks

            else:
                print("Invalid choice.")
                return

            self.save_data()
            print("Student updated successfully.")

        except ValueError:
            print("Invalid input.")

    def delete_student(self):

        student_id = input("Enter Student ID: ").strip()

        if student_id in self.students:
            del self.students[student_id]

            self.save_data()

            print("Student deleted successfully.")

        else:
            print("Student not found.")

    def show_topper(self):

        if not self.students:
            print("No student records available.")
            return

        topper = max(
            self.students.values(),
            key=lambda student: student.calculate_percentage()
        )

        print("\nTOPPER DETAILS")
        self.display_student(topper)

    def sort_students(self):

        sorted_students = sorted(
            self.students.values(),
            key=lambda student: student.calculate_percentage(),
            reverse=True
        )

        print("\nSTUDENTS RANKING")

        for rank, student in enumerate(sorted_students, start=1):
            print(
                rank,
                student.name,
                student.calculate_percentage(),
                student.calculate_grade()
            )

    def show_statistics(self):

        if not self.students:
            print("No data available.")
            return

        percentages = [
            student.calculate_percentage()
            for student in self.students.values()
        ]

        print("\nCLASS STATISTICS")
        print("Total Students:", len(self.students))
        print("Average Percentage:", sum(percentages) / len(percentages))
        print("Highest Percentage:", max(percentages))
        print("Lowest Percentage:", min(percentages))

    def run(self):

        while True:

            print("\n" + "=" * 50)
            print("STUDENT MANAGEMENT SYSTEM")
            print("=" * 50)

            print("1. Add Student")
            print("2. View All Students")
            print("3. Search Student")
            print("4. Update Student")
            print("5. Delete Student")
            print("6. Show Topper")
            print("7. Sort Students")
            print("8. Show Statistics")
            print("9. Exit")

            choice = input("\nEnter your choice: ")

            if choice == "1":
                self.add_student()

            elif choice == "2":
                self.view_students()

            elif choice == "3":
                self.search_student()

            elif choice == "4":
                self.update_student()

            elif choice == "5":
                self.delete_student()

            elif choice == "6":
                self.show_topper()

            elif choice == "7":
                self.sort_students()

            elif choice == "8":
                self.show_statistics()

            elif choice == "9":
                print("Thank you for using the system!")
                break

            else:
                print("Invalid choice. Try again.")


if __name__ == "__main__":

    application = StudentManagementSystem()

    application.run()

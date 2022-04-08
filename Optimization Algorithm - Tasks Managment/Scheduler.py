import constraint
from constraint import Domain
from constraint import Problem


class Task:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority

    def __lt__(self, other):
        return self.priority < other.priority


class TimePlace:
    def __init__(self, start, end, day, priority):
        self.start = start
        self.end = end
        self.day = day
        self.priority = priority


class CreateConstraint(constraint.Constraint):
    task_at_same_time = 1
    check_priority = 2

    def __init__(self, constraint_type, tasks):
        self.constraint_type = constraint_type
        self.tasks = tasks

    def get_constraint(self):
        if self.constraint_type == CreateConstraint.task_at_same_time:
            return constraint.FunctionConstraint(no_task_at_same_time), self.tasks

        if self.constraint_type == CreateConstraint.check_priority:
            return constraint.FunctionConstraint(higher_priority_first), self.tasks


# Constraint 1: two different tasks can't be at same time and day.
def no_task_at_same_time(*arg):
    list_of_pairs = [(arg[v1], arg[v2]) for v1 in range(len(arg)) for v2 in range(v1 + 1, len(arg))]
    for pair in list_of_pairs:
        domain_time1, domain_time2 = pair[0], pair[1]
        if is_overlapping(domain_time1, domain_time2):
            return False
    return True


# two different tasks can't be at same time and day.
def is_overlapping(domain_time1, domain_time2):
    if domain_time1.day != domain_time2.day:
        return False

    if domain_time1.start == domain_time2.start:
        return True

    if (domain_time1.start < domain_time2.start < domain_time1.end) or (
            domain_time2.start < domain_time1.start < domain_time2.end):
        return True

    return False


# Constraint 2: For a task that has the higher priority, it will be schedule earlier.
def higher_priority_first(*arg):
    list_of_pairs = [(arg[v1], arg[v2]) for v1 in range(len(arg)) for v2 in range(v1 + 1, len(arg))]
    for pair in list_of_pairs:
        domain_time1, domain_time2 = pair[0], pair[1]

        if domain_time1.priority < domain_time2.priority and domain_time1.day > domain_time2.day:
            return False

        elif domain_time1.priority < domain_time2.priority and (domain_time1.day == domain_time2.day
                                                                and domain_time1.start > domain_time2.start):
            return False

        elif domain_time2.priority < domain_time1.priority and domain_time2.day > domain_time1.day:
            return False

        elif domain_time2.priority < domain_time1.priority and (domain_time2.day == domain_time1.day
                                                                and domain_time2.start > domain_time1.start):
            return False

    return True


def get_scheduler(scheduler_variables, scheduler_domains, scheduler_constraints):
    problem = Problem()

    for var, domain in zip(scheduler_variables, scheduler_domains):
        problem.addVariable(var, domain)

    for my_constraint in scheduler_constraints:
        new_constraint, tasks = my_constraint.get_constraint()
        problem.addConstraint(new_constraint, tasks)

    results(problem)


def results(problem):
    for result in problem.getSolutions():
        for k in result.keys():
            # find day:
            day = find_day(result[k].day)

            print("----------")
            print("Task: {}".format(k.name))
            print("Day: {}, Start Hour = {}, End Hour = {}".format(day, result[k].start, result[k].end))

        print("------------------------------------\n\n")


def find_day(i):
    switcher = {
        1: 'Sunday',
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
        7: 'Saturday'
    }
    return switcher.get(i, "Invalid day of week")


def main():
    variable1 = Task("ML", 1)
    variable2 = Task("OOP", 2)
    variable3 = Task("Computer Complexity", 3)

    variables = [variable1, variable2, variable3]

    d1 = TimePlace(9, 10, 1, 1)
    d2 = TimePlace(14, 15, 2, 1)
    d3 = TimePlace(16, 17, 2, 1)
    variable1_domain = Domain([d1, d2, d3])

    d4 = TimePlace(10, 11, 1, 2)
    d5 = TimePlace(15, 16, 2, 2)
    d6 = TimePlace(16, 17, 4, 2)
    variable2_domain = Domain([d4, d5, d6])

    d7 = TimePlace(9, 12, 1, 3)
    d8 = TimePlace(12, 15, 3, 3)
    d9 = TimePlace(12, 17, 2, 3)
    variable3_domain = Domain([d7, d8, d9])

    domains = [variable1_domain, variable2_domain, variable3_domain]
    constraints = []

    task_at_same_time = CreateConstraint(CreateConstraint.task_at_same_time, variables)
    priority_first = CreateConstraint(CreateConstraint.check_priority, variables)

    constraints.append(task_at_same_time)
    constraints.append(priority_first)

    get_scheduler(variables, domains, constraints)


if __name__ == '__main__':
    main()

# Calculate positional weights (PW) for each task
def calculate_positional_weight(task, tasks):
    """Recursively calculate the positional weight for a task."""
    successors = [succ for succ, details in tasks.items() if task in details["predecessors"]]
    weight = tasks[task]["length"]
    for succ in successors:
        weight += calculate_positional_weight(succ, tasks)
    return weight

# Add PW to each task and sort tasks by PW (descending)
pw_values = {task: calculate_positional_weight(task, tasks) for task in tasks}
sorted_tasks = sorted(pw_values.items(), key=lambda x: -x[1])

# Display results for step 2
pw_values, sorted_tasks

def del_empties(text_d):
    lst = []
    for t in text_d:
        if len(t) > 0:
            lst.append(t)
    return lst


def evaluate_line(user_data, text_data):
    counter = 0
    user_d = user_data.lower().split(' ')
    text_d = del_empties(text_data.lower().split(' '))
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        u, t = user_d[i], text_d[i]
        if u == t:
            counter += 1
    return counter / (min_len + abs(len(user_data) - len(text_data)))


def evaluate_words(user_data, text_data):
    counter1 = counter2 = 0
    user_d = sorted(user_data.lower().split(' '))
    text_d = sorted(del_empties(text_data.lower().split(' ')))
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        u, t = user_d[i], text_d[i]
        if u == t:
            counter1 += 1
    for i in range(min_len):
        u, t = user_d[len(user_d) - i - 1], text_d[len(text_d) - i - 1]
        if u == t:
            counter2 += 1
    counter = max(counter1, counter2)
    return counter / (min_len + abs(len(user_data) - len(text_data)))


def evaluate_stream(user_data, text_data):
    counter1 = counter2 = 0
    user_d = user_data.lower().replace(' ', '')
    text_d = text_data.lower().replace(' ', '')
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        u, t = user_d[i], text_d[i]
        if u == t:
            counter1 += 1
    for i in range(min_len):
        u, t = user_d[len(user_d) - i - 1], text_d[len(text_d) - i - 1]
        if u == t:
            counter2 += 1
    counter = max(counter1, counter2)
    return counter / (min_len + abs(len(user_data) - len(text_data)))


def read_input(input_file):
    f = open(input_file, "r")
    user_data = f.readlines()
    f.close()
    return user_data


def evaluate(text, evaluation, input_file):
    user = read_input(input_file)
    vals = []
    f = open(text, "r")
    data = f.readlines()
    f.close()
    idx = 0
    for line in data:
        v = evaluate_line(user[idx], line) * evaluate_words(user[idx], line) * evaluate_stream(user[idx], line)
        vals.append(v ** (1. / 3))
        idx += 1
    val = sum(vals) / len(vals)
    eval_file = open(evaluation, "r+")
    eval_file.write("evaluation = " + str(val))
    eval_file.close()

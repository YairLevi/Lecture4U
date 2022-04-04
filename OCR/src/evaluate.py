import os


# deletes empty strings from line
def del_empties(text_d):
    lst = []
    for t in text_d:
        if len(t) > 0:
            lst.append(t)
    return lst


# splits the sentence into lowered words and compares their parsing to words and their order
def evaluate_line(user_data, text_data, u_len, t_len):
    counter = 0
    min_len = min(len(user_data), len(text_data))
    for i in range(min_len):
        u, t = user_data[i], text_data[i]
        counter = counter + 1 if u == t else counter
    return counter / (min_len + abs(u_len - t_len))


# splits the sentence into lowered words and compares their parsing - forward and backward alphabetically
def evaluate_words(user_data, text_data, u_len, t_len):
    counter1 = counter2 = 0
    user_d = sorted(user_data)
    text_d = sorted(text_data)
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        u, t = user_d[i], text_d[i]
        counter1 = counter1 + 1 if u == t else counter1
    for i in range(min_len):
        u, t = user_d[len(user_d) - i - 1], text_d[len(text_d) - i - 1]
        counter2 = counter2 + 1 if u == t else counter2
    return max(counter1, counter2) / (min_len + abs(u_len - t_len))


# merges all chars in the sentence into lowered stream and compares their order
def evaluate_stream(user_data, text_data):
    counter1 = counter2 = 0
    user_d = user_data.replace(' ', '')
    text_d = text_data.replace(' ', '')
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        u, t = user_d[i], text_d[i]
        counter1 = counter1 + 1 if u == t else counter1
    for i in range(min_len):
        u, t = user_d[len(user_d) - i - 1], text_d[len(text_d) - i - 1]
        counter2 = counter2 + 1 if u == t else counter2
    return max(counter1, counter2) / (min_len + abs(len(user_data) - len(text_data)))


def read_input(input_file):
    f = open(input_file, "r")
    user_data = f.readlines()
    f.close()
    return user_data


def write_evaluation(text_data, evaluation, lines_eval, words_eval, streams_eval, vals):
    # geometric average of all 3 evaluations equally in total evaluation: algebraic average of the geometric average
    # of each line. each other semi-evaluation uses algebraic average of the lines
    eval_file = open(evaluation, "r+")
    eval_file.write(text_data + "\n\n\n*****************************************************************************\n")
    line_eval = str(round(sum(lines_eval) / len(lines_eval), 8))
    eval_file.write("evaluation of words in order (compared to original text) = " + line_eval + "\n")
    word_eval = str(round(sum(words_eval) / len(words_eval), 8))
    eval_file.write("evaluation of words (compared to the words in the original text) = " + word_eval + "\n")
    stream_eval = str(round(sum(streams_eval) / len(streams_eval), 8))
    eval_file.write("evaluation of chars' stream in order (compared to original text) = " + stream_eval + "\n")
    total_eval = str(round(sum(vals) / len(vals), 8))
    eval_file.write("total evaluation = " + total_eval)
    eval_file.close()


def process_data(user_data, text_data):
    u_len, t_len = len(user_data), len(text_data)
    u_data, t_data = user_data, text_data
    u_data, t_data = u_data.split(' '), del_empties(t_data.split(' '))
    return u_len, t_len, u_data, t_data


def evaluate(text, evaluation, input_file):
    user, data = read_input(input_file), read_input(text)
    vals, lines_eval, words_eval, streams_eval = [], [], [], []
    idx = 0
    for line in data:
        line = line.rstrip() if line == data[-1] else line
        user_data, text_data = user[idx].lower(), line.lower()
        u_len, t_len, u_data, t_data = process_data(user_data, text_data)
        lines_eval.append(evaluate_line(u_data, t_data, u_len, t_len))
        words_eval.append(evaluate_words(u_data, t_data, u_len, t_len))
        streams_eval.append(evaluate_stream(user_data, text_data))
        v = lines_eval[-1] * words_eval[-1] * streams_eval[-1]
        vals.append(v ** (1. / 3))
        idx += 1
    write_evaluation(''.join(data).rstrip(), evaluation, lines_eval, words_eval, streams_eval, vals)
    os.remove(text)
    return 0

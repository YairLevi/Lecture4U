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
        counter = counter + 1 if user_data[i] == text_data[i] else counter
    return counter / (min_len + abs(u_len - t_len))


# splits the sentence into lowered words and compares their parsing - forward and backward alphabetically
def evaluate_words(user_data, text_data, u_len, t_len):
    counter1 = counter2 = 0
    user_d, text_d = sorted(user_data), sorted(text_data)
    min_len = min(len(user_d), len(text_d))
    for i in range(min_len):
        counter1 = counter1 + 1 if user_d[i] == text_d[i] else counter1
    for i in range(min_len):
        counter2 = counter2 + 1 if user_d[len(user_d) - i - 1] == text_d[len(text_d) - i - 1] else counter2
    return max(counter1, counter2) / (min_len + abs(u_len - t_len))


# merges all chars in the sentence into lowered stream and compares their similarity
def evaluate_stream(user_data, text_data):
    counter = 0
    user_d, text_d = user_data.replace(' ', ''), text_data.replace(' ', '')
    letters = 'abcdefghijklmnopqrstuvwxyz'
    for l in letters:
        counter = (counter + 1) if user_d.count(l) == text_d.count(l) else counter
    return counter / len(letters)


# returns the read data as a lines' array
def read_data(input_file):
    f = open(input_file, "r")
    data = f.readlines()
    f.close()
    return data


# geometric average of all 3 evaluations equally in total evaluation: algebraic average of the geometric average of
# each line. each other semi-evaluation uses algebraic average of the lines
def write_evaluation(text_data, evaluation, lines_eval, words_eval, streams_eval, values, lens):
    eval_file = open(evaluation, "w+")
    eval_file.write(text_data + "\n\n\n*****************************************************************************\n")
    line_eval = str(round(sum(lines_eval) / len(lines_eval), 8))
    eval_file.write("evaluation of words in order (compared to original text) = " + line_eval + "\n")
    word_eval = str(round(sum(words_eval) / len(words_eval), 8))
    eval_file.write("evaluation of words (compared to the words in the original text) = " + word_eval + "\n")
    stream_eval = str(round(sum(streams_eval) / len(streams_eval), 8))
    eval_file.write("evaluation of chars' stream in order (compared to original text) = " + stream_eval + "\n")
    total_eval = str(round(sum(values) / sum(lens), 8))  # str(round(sum(values) / len(values), 8))
    eval_file.write("total evaluation = " + total_eval)
    eval_file.close()
    return total_eval


# returns line's length and parses its words
def process_data(user_data, text_data):
    user_data, text_data = user_data, text_data
    u_len, t_len = len(user_data), len(text_data)
    u_data, t_data = user_data, text_data
    u_data, t_data = u_data.split(' '), del_empties(t_data.split(' '))
    return u_len, t_len, u_data, t_data


# main evaluation function
def evaluate(text, evaluation, input_file):
    user, data = read_data(input_file), read_data(text)
    values, lines_eval, words_eval, streams_eval, lens = [], [], [], [], []
    idx = 0
    for line in data:
        line = line.rstrip() if line == data[-1] else line
        user_data, text_data = user[idx].lower().replace('\n', ''), line.lower().replace('\n', '')
        max_len = max(len(user_data), len(text_data))
        lens.append(max_len)
        u_len, t_len, u_data, t_data = process_data(user_data, text_data)
        lines_eval.append(evaluate_line(u_data, t_data, u_len, t_len))
        words_eval.append(evaluate_words(u_data, t_data, u_len, t_len))
        streams_eval.append(evaluate_stream(user_data, text_data))
        values.append(max_len * (lines_eval[-1] * words_eval[-1] * (streams_eval[-1]) ** 4) ** (1. / 6))
        idx += 1
    return write_evaluation(''.join(data).rstrip(), evaluation, lines_eval, words_eval, streams_eval, values, lens)

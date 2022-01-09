import matplotlib.pyplot as plt
import cv2

img = cv2.imread('example8.PNG')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Find the optimum threshold to your image --> Otsu threshold.
# Otsu threshold is used to perform automatic image thresholding.
# In the simplest form, the algorithm returns a single intensity
# threshold that separate pixels into two classes, foreground and background:

# --- performing Otsu threshold ---
ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
color = cv2.cvtColor(thresh1, cv2.COLOR_BGR2RGB)
plt.imshow(color)
plt.show()

# Find the suitable morphological operation that will form a single region along the horizontal direction.
# Choose a kernel that is larger in width than the height:

# --- choosing the right kernel
# --- kernel size of 3 rows (to join dots above letters 'i' and 'j')
# --- and 10 columns to join neighboring letters in words and neighboring words
rect_kernel = cv2.getStructuringElement(shape=cv2.MORPH_RECT, ksize=(70, 1))
dilation = cv2.dilate(thresh1, rect_kernel, iterations=1)
color = cv2.cvtColor(dilation, cv2.COLOR_BGR2RGB)
plt.imshow(color)
plt.show()

# Draw bounding boxes over the resulting contours and iterate through contours and extract ROI using Numpy slicing:

# ---Finding contours ---
contours, hierachy = cv2.findContours(dilation, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

im2 = img.copy()
ROI_number = 0
height_threshold = 10
width_threshold = 10
for c in contours:
    x, y, w, h = cv2.boundingRect(c)
    ROI = img[y:y + h, x:x + w]

    # We check if the size of the rectangle (ROI) is too small,
    # then it indicates that there is no text in the rectangle.
    if ROI.shape[0] < height_threshold or ROI.shape[1] < width_threshold or \
            ((ROI.shape[0] < 2*height_threshold) and (ROI.shape[1] < 2*width_threshold)):
        continue

    cv2.rectangle(im2, (x, y), (x + w, y + h), (36, 255, 12), 2)
    ROI_number += 1

    # convert the image to black and white:
    ret, thresh1 = cv2.threshold(cv2.cvtColor(ROI, cv2.COLOR_BGR2GRAY), 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    color = cv2.cvtColor(thresh1, cv2.COLOR_BGR2RGB)
    color = 255 - color

    # save the image:
    # cv2.imwrite('ROI_{}.png'.format(ROI_number), color)

# show the final image:
color = cv2.cvtColor(im2, cv2.COLOR_BGR2RGB)
plt.title("Final image:")
plt.imshow(color)
plt.show()

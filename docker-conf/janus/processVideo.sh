#!/bin/sh

ROOM=${1?Error: no room given}
search_dir="/path/to/recordings-folder/${ROOM}"

if [ -d "$search_dir" ]; then
  file_name_arr=()
  for entry in "$search_dir"/*; do
      file_name=$(basename -- "$entry")
      extension="${file_name##*.}"
      file_name="${file_name%.*}"
      echo "$file_name"
      file_name_arr+=($file_name)
  done

  # get unique values
  file_name_arr=($(echo "${file_name_arr[@]}" | sed -e 's/-audio//g' | sed -e 's/-video//g' | tr ' ' '\n' | sort -u | tr '\n' ' '))

  echo "${!file_name_arr[@]}"
  for index in "${!file_name_arr[@]}"; do
      echo "$index - ${file_name_arr[$index]}";
      /opt/janus/bin/janus-pp-rec "$search_dir/${file_name_arr[$index]}-video.mjr" "$search_dir/${file_name_arr[$index]}-only-video.webm"
      /opt/janus/bin/janus-pp-rec "$search_dir/${file_name_arr[$index]}-audio.mjr" "$search_dir/${file_name_arr[$index]}.opus"
      ffmpeg -i "$search_dir/${file_name_arr[$index]}.opus" -i "$search_dir/${file_name_arr[$index]}-only-video.webm"  -c:v copy -c:a opus -strict experimental "$search_dir/${file_name_arr[$index]}.webm"
      rm -rf "$search_dir/${file_name_arr[$index]}-video.mjr" "$search_dir/${file_name_arr[$index]}-audio.mjr" "$search_dir/${file_name_arr[$index]}.opus" "$search_dir/${file_name_arr[$index]}-only-video.webm"
  done
fi


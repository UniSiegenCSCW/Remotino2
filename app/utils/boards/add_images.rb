require "json"

paths = Dir["*.json"]
paths.each do |path|
  file = File.read(path)
  data = JSON.parse(file)

  svg_path = path.gsub("json", "svg")
  if File.exists?(svg_path)
    data["image"] = svg_path
    puts path
  end

  File.open(path, "w") do |f|
    f.puts JSON.pretty_generate(data)
  end
end

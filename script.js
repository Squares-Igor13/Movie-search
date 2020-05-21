

 

// The Fast and the Furious
//поля формы
let title = document.querySelector('#title'),
	type = document.querySelector('#type'),
	search = document.querySelector('#btn')

//получаем элементы для заполнения
let img = document.querySelector('img'),
	name = document.querySelector('#name'),
	year = document.querySelector('#year'),
	curType = document.querySelector('#curType')

//содержимое с фильмами
let content = document.querySelector('#content')

//блок с кнопками
let pages = document.querySelector('#pages')
//получаем кнопки
let prev = document.querySelector('#prev'),
	next = document.querySelector('#next')

//блок информации о фильме
let info = document.querySelector('#info')
let imgMovie = document.querySelector('#imgMovie'),
	titleInfo = document.querySelector('#titleInfo'),
	released = document.querySelector('#released'),
	genre = document.querySelector('#genre'),
	country = document.querySelector('#country'),
	director = document.querySelector('#director'),
	writer = document.querySelector('#writer'),
	actors = document.querySelector('#actors'),
	awards = document.querySelector('#awards')

//номер текущей страницы
let page = 1
//всего страниц
let totalPage

//показываемые кнопки
let start = 0,
	end = 9


//предупреждение о том что ничего не найдено
let notFound = document.querySelector('.notFound')

//событие которое обновляет/стирает старую информацию
search.addEventListener('click', function() {
	if(btns != null) {
		for(let i = 0; i < btns.length; i++) {
			btns[i].remove()
		}
	}
	//переводим для того что бы сменить пагинацию
	btns = null
	//каждый раз при поиске нового фильма начинать с первой страницы
	page = 1

	//скрываем блок информации о фильме
	info.style.display = 'none'

	
})

//добавляем основное событие при нажатии поиска
search.addEventListener('click', findMovie)


//кнопки перехода (цифровые)
let btns = null
function findMovie() {

	if(title.value == '') return

	let request = new XMLHttpRequest()
	
	request.open('GET', `http://www.omdbapi.com/?s=${title.value}&type=${type.value}&page=${page}&apikey=aa93b4f0`)
	request.responseType = 'json'
	console.log(type.value)

	request.onload = function() {
		if(request.status === 200) {
			
			//если в ответе фильм не найден, убираем лишние поля, кнопки
			if(request.response.Response == "False") {
				notFound.style.display = 'block'
				content.innerHTML = ''
				prev.style.display = 'none'
				next.style.display = 'none'
				return
			}
			//подсказка что фильмы не найдены
			notFound.style.display = 'none'

			totalPage = Math.ceil(request.response.totalResults / 10)

			if(totalPage <= 1) {
				prev.style.display = 'none'
				next.style.display = 'none'
			}
			//стираем найденные фильмы при нажатии на кнопку поиска
			content.innerHTML = ''

			//добавляем пагинацию если нужна
			if(totalPage > 1 && btns == null) {
				//показываем стрелки влево-вправо
				prev.style.display = 'block'
				next.style.display = 'block'


				for(let i = 1; i <= totalPage; i++) {
					
					let btn = document.createElement('button')
					btn.textContent = i
					btn.classList.add('btns')
					next.before(btn)	
				}
				btns = document.querySelectorAll('.btns')
				btns[0].classList.add('active')

				tenBtns(btns)
			}
			
			//если не найдено
			if(request.response.Response == "False") return

			for(let i = 0; i < request.response.Search.length; i++) {

				let find = request.response.Search[i]

				//если нет обложки фильма, заменяем своей картинкой
				let poster = (find.Poster != "N/A") ? find.Poster : "xz.png"

				//добавляем фильмы на страницу
				let str = `
					<div class="border rounded card">
			            <div class="row">
			              <div class="col-6" class="img">
			                <img src=${poster} alt="img" class="p-1">
			              </div>
			              <div class="col-6 pl-0 pr-4 flex">
			              	<div>
			                	<p>${type.value}</p>
			                	<h6>${find.Title}</h6>
			                	<p>${find.Year}</p>
			                </div>
			                <button class="rounded btn-outline-primary btn-block pr-1 myBtn">Details</button>
			              </div>
			            </div>
			        </div>
				`

				let div = document.createElement('div')
				div.classList.add('col-md-6', 'col-lg-4')
				div.innerHTML = str
				content.append(div)
			}

			//получаем кнопки подробной информации
			let myBtn = document.querySelectorAll('.myBtn')
			for(let i = 0; i < myBtn.length; i++) {
				myBtn[i].addEventListener('click', function() {
					info.style.display = 'block'
					//найденный фильм
					let find = request.response.Search[i]
					//его ID
					let movieID = find.imdbID

					//создаем еще один запрос к более подробной информации, для заполнения поля информации
					let request2 = new XMLHttpRequest()
					//ищем фильм по его ID
					request2.open('GET', `http://www.omdbapi.com/?i=${movieID}&apikey=aa93b4f0`)
					request2.responseType = 'json'

					request2.onload = function() {
						if(request2.status === 200) {
							console.log(request2.response)
							//заполняем содержимым
							let movie = request2.response
							imgMovie.src = (movie.Poster != 'N/A') ? find.Poster : "xz.png"
							titleInfo.textContent = movie.Title
							released .textContent = movie.Released
							genre.textContent = movie.Genre
							country.textContent = movie.Country
							director.textContent = movie.Director
							writer.textContent = movie.Writer
							actors.textContent = movie.Actors
							awards.textContent = movie.Awards
						} else {
							alert('Error occurred? please try again')
						}
					}

					request2.send()

				})
			}

			
		} else {
			console.error('Not found')
		}
	}

	request.send()

}



	//листаем страницу вперед
	next.addEventListener('click', function() {

		if(page == totalPage) return

		//после каждой 10 кнопки, меняем очередную десятку кнопок
		if(page%10 == 0) {
			start += 10
			end += 10

			tenBtns(btns)
		}

		page = page + 1
		console.log(page)

		//убираем класс у всех кнопок
		for(i = 0; i < btns.length; i++) {
			btns[i].classList.remove('active')
		}
		//и делаем только текущую активной
		btns[page-1].classList.add('active')

		//вызываем основную функцию с новым параметром
		findMovie(page)
		

	})
	//назад
	prev.addEventListener('click', function() {

		if(page == 1) return

		//меняем при каждой (11, 21, 31 и т.д)
		if(page%10 == 1) {
			start -= 10
			end -= 10

			tenBtns(btns)
		}

		page = page - 1
		console.log(page)
		
		//делаем только текущую кнопку активной
		for(i = 0; i < btns.length; i++) {
			btns[i].classList.remove('active')
		}
		btns[page-1].classList.add('active')

		//вызываем основную функцию с новым параметром
		findMovie(page)

	})



//переход по кнопкам страниц
pages.addEventListener('click', function(event) {

	let target = event.target

	//если нажали по нужной нам кнопке (с классом btns)
	if(target.classList.contains('btns')) {
		page = +target.textContent
		findMovie(page)
		//подсвечиваем активную кнопку
		for(i = 0; i < btns.length; i++) {
			btns[i].classList.remove('active')
		}
		target.classList.add('active')
		console.log(page)

	}

})


//показываем очередную дусятку кнопок, находящихся в интервале (start-end)
function tenBtns(arr) {
	//делаем все кнопки видимые
	for(let i = 0; i < arr.length; i++) {
		arr[i].style.display = 'block'
	}
	//и тут же скрываем все кроме нужных в интервале
	for(let i = 0; i < arr.length; i++) {

		if(i >= start && i <= end) continue

		arr[i].style.display = 'none'
	}
}








		




	
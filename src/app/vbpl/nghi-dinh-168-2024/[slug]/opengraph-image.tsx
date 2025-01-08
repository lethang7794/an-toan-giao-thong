import { cache } from 'react'
import { ImageResponse } from 'next/og'
import yaml from 'yaml'

export const runtime = 'edge'

import {
  explain168Section,
  isChuong,
  isDiem,
  isDieu,
  isKhoan,
  isMuc,
} from '@/lib/explain-share-link'
import type { ND168 } from '@/model/ND168'

export function explainDetail168Section(id?: string): {
  type?: 'chuong' | 'muc' | 'dieu' | 'khoan' | 'diem'
  path?: string
  chuong?: ND168
  muc?: ND168
  dieu?: ND168
  khoan?: ND168
  diem?: ND168
} {
  if (!id) {
    return { path: '' }
  }

  const curDetail = getND168ById(id)

  if (isChuong(id)) {
    return {
      type: 'chuong',
      path: `Chương ${id}`,
      chuong: curDetail,
    }
  }
  if (isMuc(id)) {
    const [chuong, muc] = id.split('.')
    return {
      type: 'muc',
      path: `Chương ${chuong}, mục ${muc}`,
      chuong: getND168ById(chuong),
      muc: curDetail,
    }
  }
  if (isDieu(id)) {
    return {
      type: 'dieu',
      path: `Điều ${id}`,
      dieu: curDetail,
    }
  }
  if (isKhoan(id)) {
    const [dieu, khoan] = id.split('.')
    return {
      type: 'khoan',
      path: `Khoản ${khoan}, Điều ${dieu}`,
      dieu: getND168ById(dieu),
      khoan: curDetail,
    }
  }
  if (isDiem(id)) {
    const [dieu, khoan, diem] = id.split('.')
    return {
      type: 'diem',
      path: `Điểm ${diem}, khoản ${khoan}, Điều ${dieu}`,
      dieu: getND168ById(dieu),
      khoan: getND168ById(`${dieu}.${khoan}`),
      diem: curDetail,
    }
  }

  return { path: '' }
}

// Image metadata
export const alt = 'About Acme' // TODO
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default function Image({ params }: { params: { slug: string } }) {
  const explain = explain168Section(params.slug || '').path
  const explainDetail = explainDetail168Section(params.slug || '')
  console.log({ explainDetail })

  let detail1 = ''
  let detail2 = ''
  let detail3 = ''
  if (explainDetail.type === 'chuong') {
    detail1 = explainDetail.chuong?.full_name || ''
  }
  if (explainDetail.type === 'muc') {
    detail1 = explainDetail.chuong?.full_name || ''
    detail2 = explainDetail.muc?.full_name || ''
  }
  if (explainDetail.type === 'dieu') {
    detail1 = explainDetail.dieu?.full_name || ''
  }
  if (explainDetail.type === 'khoan') {
    detail1 = explainDetail.dieu?.full_name || ''
    detail2 = explainDetail.khoan?.full_name || ''
  }
  if (explainDetail.type === 'diem') {
    detail1 = explainDetail.dieu?.full_name || ''
    detail2 = explainDetail.khoan?.full_name || ''
    detail3 = explainDetail.diem?.full_name || ''
  }

  return new ImageResponse(
    <div
      style={{
        backgroundColor: 'black',
        backgroundSize: '150px 150px',
        height: '100%',
        width: '100%',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'nowrap',
      }}
    >
      {/* <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <img
          alt="Vercel"
          height={200}
          src="data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
          style={{ margin: '0 30px' }}
          width={232}
        />
      </div> */}
      <div
        style={{
          fontSize: 24,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'white',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          // whiteSpace: 'pre-wrap',
        }}
      >
        {`${explain} | Nghị định 168/2024`}
      </div>
      <div
        style={{
          fontSize: 24,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'white',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          // whiteSpace: 'pre-wrap',
        }}
      >
        {detail1}
      </div>
      <div
        style={{
          fontSize: 24,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'white',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          // whiteSpace: 'pre-wrap',
        }}
      >
        {detail2}
      </div>
      <div
        style={{
          fontSize: 24,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'white',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          // whiteSpace: 'pre-wrap',
        }}
      >
        {detail3}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}

export const getND168s = cache(() => {
  const data = yaml.parse(ND168s)
  return data as Record<string, ND168>
})

export function getND168ById(id: string): ND168 | undefined {
  const items = getND168s()
  return items[id]
}

// TODO: Load data from remote location
const ND168s = `
I:
  code_name: I
  full_name: NHỮNG QUY ĐỊNH CHUNG

1:
  code_name: 1
  full_name: Phạm vi điều chỉnh

1.1:
  code_name: 1
  full_name: "Nghị định này quy định về:"

1.1.a:
  code_name: a
  full_name: "Xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ bao gồm: hành vi vi phạm hành chính; hình thức, mức xử phạt, biện pháp khắc phục hậu quả đối với từng hành vi vi phạm hành chính; thẩm quyền lập biên bản, thẩm quyền xử phạt, mức phạt tiền cụ thể theo từng chức danh đối với hành vi vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ;"

1.1.b:
  code_name: b
  full_name: "Mức trừ điểm giấy phép lái xe đối với từng hành vi vi phạm hành chính; trình tự, thủ tục, thẩm quyền trừ điểm, phục hồi điểm giấy phép lái xe để quản lý việc chấp hành pháp luật về trật tự, an toàn giao thông đường bộ của người lái xe."

1.2:
  code_name: 2
  full_name: "Các hành vi vi phạm hành chính trong lĩnh vực quản lý nhà nước khác liên quan đến trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ mà không quy định tại Nghị định này thì áp dụng quy định tại các Nghị định quy định về xử phạt vi phạm hành chính trong các lĩnh vực đó để xử phạt."

2:
  code_name: 2
  full_name: Đối tượng áp dụng

2.1:
  code_name: 1
  full_name: "Cá nhân, tổ chức Việt Nam; cá nhân, tổ chức nước ngoài có hành vi vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ trên lãnh thổ nước Cộng hòa xã hội chủ nghĩa Việt Nam."

2.2:
  code_name: 2
  full_name: "Tổ chức quy định tại khoản 1 Điều này bao gồm:"

2.2.a:
  code_name: a
  full_name: "Cơ quan nhà nước có hành vi vi phạm mà hành vi đó không thuộc nhiệm vụ quản lý nhà nước được giao;"

2.2.b:
  code_name: b
  full_name: "Đơn vị sự nghiệp công lập;"

2.2.c:
  code_name: c
  full_name: "Tổ chức chính trị - xã hội, tổ chức chính trị xã hội nghề nghiệp, tổ chức xã hội, tổ chức xã hội nghề nghiệp;"

2.2.d:
  code_name: d
  full_name: "Tổ chức kinh tế được thành lập theo quy định của Luật Doanh nghiệp gồm: doanh nghiệp tư nhân, công ty cổ phần, công ty trách nhiệm hữu hạn, công ty hợp danh và các đơn vị phụ thuộc doanh nghiệp (chi nhánh, văn phòng đại diện);"

2.2.đ:
  code_name: đ
  full_name: "Tổ chức kinh tế được thành lập theo quy định của Luật Hợp tác xã gồm: tổ hợp tác, hợp tác xã, liên hiệp hợp tác xã;"

2.2.e:
  code_name: e
  full_name: "Cơ sở đào tạo lái xe, trung tâm sát hạch lái xe, cơ sở đăng kiểm xe cơ giới, xe máy chuyên dùng, cơ sở thử nghiệm, sản xuất, lắp ráp, nhập khẩu, bảo hành, bảo dưỡng xe cơ giới, xe máy chuyên dùng;"

2.2.g:
  code_name: g
  full_name: "Các tổ chức khác được thành lập theo quy định của pháp luật;"

2.2.h:
  code_name: h
  full_name: "Cơ quan, tổ chức nước ngoài được cấp có thẩm quyền của Việt Nam cho phép hoạt động trên lãnh thổ Việt Nam."

2.3:
  code_name: 3
  full_name: "Hộ kinh doanh, hộ gia đình thực hiện hành vi vi phạm hành chính quy định tại Nghị định này bị xử phạt như đối với cá nhân vi phạm."

2.4:
  code_name: 4
  full_name: "Người có thẩm quyền lập biên bản vi phạm hành chính, thẩm quyền xử phạt vi phạm hành chính và tổ chức, cá nhân có liên quan đến việc xử phạt vi phạm hành chính theo quy định tại Nghị định này."

2.5:
  code_name: 5
  full_name: "Người có thẩm quyền trừ điểm, phục hồi điểm giấy phép lái xe."

3:
  code_name: 3
  full_name: Hình thức xử phạt vi phạm hành chính, biện pháp khắc phục hậu quả; thu hồi giấy phép, chứng chỉ hành nghề

3.1:
  code_name: 1
  full_name: "Đối với mỗi hành vi vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ, cá nhân, tổ chức vi phạm phải chịu một trong các hình thức xử phạt chính sau đây:"

3.1.a:
  code_name: a
  full_name: "Cảnh cáo;"

3.1.b:
  code_name: b
  full_name: "Phạt tiền;"

3.1.c:
  code_name: c
  full_name: "Tịch thu phương tiện được sử dụng để vi phạm hành chính."

3.2:
  code_name: 2
  full_name: "Căn cứ vào tính chất, mức độ vi phạm, cá nhân, tổ chức vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ còn có thể bị áp dụng một hoặc nhiều hình thức xử phạt bổ sung sau đây:"

3.2.a:
  code_name: a
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn;"

3.2.b:
  code_name: b
  full_name: "Đình chỉ hoạt động có thời hạn;"

3.2.c:
  code_name: c
  full_name: "Tịch thu tang vật vi phạm hành chính, phương tiện được sử dụng để vi phạm hành chính trong trường hợp không áp dụng là hình thức xử phạt chính theo quy định tại điểm c khoản 1 Điều này."

3.3:
  code_name: 3
  full_name: "Các biện pháp khắc phục hậu quả vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ bao gồm:"

3.3.a:
  code_name: a
  full_name: "Buộc khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra, trừ các biện pháp khắc phục hậu quả quy định tại điểm e, điểm n, điểm p khoản này;"

3.3.b:
  code_name: b
  full_name: "Buộc thực hiện biện pháp khắc phục tình trạng ô nhiễm môi trường do vi phạm hành chính gây ra;"

3.3.c:
  code_name: c
  full_name: "Buộc tái xuất phương tiện khỏi Việt Nam;"

3.3.d:
  code_name: d
  full_name: "Buộc nộp lại số lợi bất hợp pháp có được do thực hiện vi phạm hành chính;"

3.3.đ:
  code_name: đ
  full_name: "Buộc phá dỡ các vật che khuất biển báo hiệu đường bộ, đèn tín hiệu giao thông;"

3.3.e:
  code_name: e
  full_name: "Buộc lắp đầy đủ thiết bị hoặc thay thế thiết bị đủ tiêu chuẩn, quy chuẩn an toàn kỹ thuật hoặc khôi phục lại tính năng kỹ thuật của phương tiện, thiết bị theo quy định hoặc tháo bỏ những thiết bị lắp thêm không đúng quy định;"

3.3.g:
  code_name: g
  full_name: "Buộc cấp thẻ nhận dạng lái xe cho lái xe theo quy định;"

3.3.h:
  code_name: h
  full_name: "Buộc tổ chức tập huấn, hướng dẫn nghiệp vụ, quy trình hoặc tổ chức khám sức khỏe định kỳ cho lái xe và nhân viên phục vụ trên xe theo quy định;"

3.3.i:
  code_name: i
  full_name: "Buộc lắp đặt thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe, dây đai an toàn, ghế ngồi cho trẻ em mầm non, học sinh tiểu học, dụng cụ, thiết bị chuyên dùng để cứu hộ, hỗ trợ cứu hộ trên xe theo đúng quy định;"

3.3.k:
  code_name: k
  full_name: "Buộc tháo dỡ thiết bị âm thanh, ánh sáng lắp đặt trên xe gây mất trật tự, an toàn giao thông đường bộ;"

3.3.l:
  code_name: l
  full_name: "Buộc cung cấp, cập nhật, truyền dẫn, lưu trữ, quản lý thông tin, dữ liệu từ thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô theo quy định;"

3.3.m:
  code_name: m
  full_name: "Buộc điều chỉnh lại chỉ số trên đồng hồ báo quãng đường của xe ô tô bị làm sai lệch;"

3.3.n:
  code_name: n
  full_name: "Buộc khôi phục lại nhãn hiệu, màu sơn ghi trong chứng nhận đăng ký xe theo quy định;"

3.3.o:
  code_name: o
  full_name: "Buộc thực hiện đúng quy định về biển số xe, quy định về kẻ hoặc dán chữ, số biển số, thông tin trên thành xe, cửa xe, quy định về màu sơn, biển báo dấu hiệu nhận biết của xe;"

3.3.p:
  code_name: p
  full_name: "Buộc khôi phục lại hình dáng, kích thước, tình trạng an toàn kỹ thuật ban đầu của xe và đăng kiểm lại trước khi đưa phương tiện ra tham gia giao thông;"

3.3.q:
  code_name: q
  full_name: "Buộc thực hiện điều chỉnh thùng xe theo đúng quy định hiện hành, đăng kiểm lại và điều chỉnh lại khối lượng hàng hóa cho phép chuyên chở được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường theo quy định hiện hành trước khi đưa phương tiện ra tham gia giao thông;"

3.3.r:
  code_name: r
  full_name: "Buộc làm thủ tục đổi, thu hồi, cấp mới, cấp chứng nhận đăng ký xe, biển số xe, giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường theo quy định;"

3.3.s:
  code_name: s
  full_name: "Buộc nộp lại giấy phép, chứng chỉ hành nghề bị tẩy xóa, sửa chữa làm sai lệch nội dung;"

3.3.t:
  code_name: t
  full_name: "Buộc đưa phương tiện quay trở lại Khu kinh tế thương mại đặc biệt, Khu kinh tế cửa khẩu quốc tế."

3.4:
  code_name: 4
  full_name: "Thủ tục thi hành biện pháp khắc phục hậu quả buộc nộp lại giấy phép, chứng chỉ hành nghề bị tẩy xóa, sửa chữa làm sai lệch nội dung; thu hồi giấy phép, chứng chỉ hành nghề đã hết giá trị sử dụng hoặc không do cơ quan có thẩm quyền cấp"

3.4.a:
  code_name: a
  full_name: |+
    - Cá nhân, tổ chức vi phạm có trách nhiệm thi hành biện pháp khắc phục hậu quả buộc nộp lại giấy phép, chứng chỉ hành nghề bị tẩy xóa, sửa chữa làm sai lệch nội dung gồm: giấy phép lái xe; chứng nhận đăng ký xe; bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe; giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường của phương tiện bị tẩy xóa, sửa chữa làm sai lệch nội dung thực hiện theo quy định tại Điều 85 của Luật Xử lý vi phạm hành chính.

    - Người có thẩm quyền ra quyết định thi hành biện pháp khắc phục hậu quả chuyển giấy phép, chứng chỉ hành nghề bị tẩy xóa, sửa chữa làm sai lệch nội dung cho cơ quan, người có thẩm quyền đã cấp giấy phép, chứng chỉ hành nghề đó;

3.4.b:
  code_name: b
  full_name: |+
    - Đối với giấy phép, chứng chỉ hành nghề đã hết giá trị sử dụng hoặc không do cơ quan có thẩm quyền cấp (giấy phép lái xe không do cơ quan có thẩm quyền cấp, không hợp lệ; phù hiệu, giấy phép lưu hành đã hết giá trị sử dụng hoặc không do cơ quan có thẩm quyền cấp; hồ sơ, các loại giấy tờ, tài liệu bị tẩy xóa, sửa chữa hoặc giả mạo; chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp hoặc không đúng với số khung, số động cơ (số máy); giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường không do cơ quan có thẩm quyền cấp), người có thẩm quyền tạm giữ phải tiến hành thu hồi theo quy định.

    - Trường hợp người có thẩm quyền tạm giữ giấy phép, chứng chỉ hành nghề không có thẩm quyền thu hồi giấy phép, chứng chỉ hành nghề đó thì phải chuyển cho cơ quan, người có thẩm quyền đã cấp các loại giấy tờ đó để xử lý theo quy định của pháp luật (trừ trường hợp vụ việc có dấu hiệu tội phạm) và thông báo cho cá nhân, tổ chức vi phạm biết.

4:
  code_name: 4
  full_name: Thời hiệu xử phạt vi phạm hành chính; hành vi vi phạm hành chính đã kết thúc, hành vi vi phạm hành chính đang thực hiện

4.1:
  code_name: 1
  full_name: "Thời hiệu xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ là 01 năm."

4.2:
  code_name: 2
  full_name: |+
    Thời hạn sử dụng kết quả thu thập được bằng phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật do cá nhân, tổ chức cung cấp để xác định cá nhân, tổ chức vi phạm được tính từ thời điểm phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật của cá nhân, tổ chức ghi nhận được kết quả cho đến hết ngày cuối cùng của thời hiệu xử phạt vi phạm hành chính đối với hành vi vi phạm quy định tại khoản 1 Điều 6 của Luật Xử lý vi phạm hành chính.

    Quá thời hạn nêu trên mà người có thẩm quyền không ra quyết định xử phạt theo quy định thì kết quả thu thập được bằng phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật do cá nhân, tổ chức cung cấp không còn giá trị sử dụng. Trường hợp cá nhân, tổ chức cố tình trốn tránh, cản trở việc xử phạt thì thời hạn sử dụng kết quả thu thập được bằng phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật do cá nhân, tổ chức cung cấp được tính lại kể từ thời điểm chấm dứt hành vi trốn tránh, cản trở việc xử phạt.

4.3:
  code_name: 3
  full_name: "Hành vi vi phạm hành chính đã kết thúc, hành vi vi phạm hành chính đang thực hiện"

4.3.a:
  code_name: a
  full_name: "Việc xác định hành vi vi phạm hành chính đã kết thúc, hành vi vi phạm hành chính đang thực hiện để tính thời hiệu xử phạt vi phạm hành chính được thực hiện theo quy định của pháp luật về xử lý vi phạm hành chính;"

4.3.b:
  code_name: b
  full_name: "Đối với các hành vi vi phạm được phát hiện thông qua phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật do cá nhân, tổ chức cung cấp: thời điểm chấm dứt hành vi vi phạm được tính từ thời điểm phương tiện, thiết bị kỹ thuật nghiệp vụ, phương tiện, thiết bị kỹ thuật ghi nhận hành vi vi phạm."

5:
  code_name: 5
  full_name: Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn

5.1:
  code_name: 1
  full_name: "Giấy phép, chứng chỉ hành nghề bị tước quyền sử dụng có thời hạn trong Nghị định này gồm:"

5.1.a:
  code_name: a
  full_name: "Phù hiệu cấp cho xe ô tô tham gia kinh doanh vận tải;"

5.1.b:
  code_name: b
  full_name: "Giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường;"

5.1.c:
  code_name: c
  full_name: "Giấy phép đào tạo lái xe;"

5.1.d:
  code_name: d
  full_name: "Giấy phép sát hạch;"

5.1.đ:
  code_name: đ
  full_name: "Giấy chứng nhận đủ điều kiện hoạt động kiểm định xe cơ giới;"

5.1.e:
  code_name: e
  full_name: "Chứng chỉ đăng kiểm viên;"

5.1.g:
  code_name: g
  full_name: "Giấy phép lái xe quốc gia; giấy phép lái xe quốc tế do các nước tham gia Công ước của Liên hợp quốc về Giao thông đường bộ năm 1968 cấp (trừ giấy phép lái xe quốc tế do Việt Nam cấp); giấy phép lái xe quốc tế mà Việt Nam ký kết điều ước quốc tế về việc công nhận lẫn nhau giấy phép lái xe quốc tế."

5.2:
  code_name: 2
  full_name: |+
    Trình tự, thủ tục tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ được thực hiện theo quy định của pháp luật về xử lý vi phạm hành chính.

    Trường hợp một cá nhân thực hiện nhiều hành vi vi phạm hành chính mà bị xử phạt trong cùng một lần thì bị phạt tiền đối với từng hành vi vi phạm, nếu có hành vi vi phạm bị tước quyền sử dụng giấy phép lái xe và hành vi vi phạm bị trừ điểm giấy phép lái xe thì chỉ áp dụng hình thức tước quyền sử dụng giấy phép lái xe.

5.3:
  code_name: 3
  full_name: "Thời điểm bắt đầu tính thời hạn tước quyền sử dụng giấy phép, chứng chỉ hành nghề như sau:"

5.3.a:
  code_name: a
  full_name: "Trường hợp tại thời điểm ra quyết định xử phạt vi phạm hành chính mà người có thẩm quyền xử phạt đã tạm giữ được giấy phép, chứng chỉ hành nghề của cá nhân, tổ chức vi phạm thì thời điểm bắt đầu tính thời hạn tước quyền sử dụng giấy phép, chứng chỉ hành nghề là thời điểm quyết định xử phạt vi phạm hành chính có hiệu lực thi hành;"

5.3.b:
  code_name: b
  full_name: "Trường hợp tại thời điểm ra quyết định xử phạt vi phạm hành chính mà người có thẩm quyền xử phạt chưa tạm giữ được giấy phép, chứng chỉ hành nghề của cá nhân, tổ chức vi phạm thì người có thẩm quyền xử phạt vẫn ra quyết định xử phạt vi phạm hành chính theo quy định đối với hành vi vi phạm. Trong nội dung quyết định xử phạt phải ghi rõ thời điểm bắt đầu tính hiệu lực thi hành của hình thức xử phạt bổ sung tước quyền sử dụng giấy phép, chứng chỉ hành nghề là kể từ thời điểm mà người vi phạm xuất trình giấy phép, chứng chỉ hành nghề cho người có thẩm quyền xử phạt tạm giữ;"

5.3.c:
  code_name: c
  full_name: "Khi giữ và trả lại giấy phép, chứng chỉ hành nghề bị tước quyền sử dụng theo quy định tại điểm b khoản này, người có thẩm quyền xử phạt phải lập biên bản và lưu hồ sơ xử phạt vi phạm hành chính."

5.4:
  code_name: 4
  full_name: "Trong thời gian bị tước quyền sử dụng giấy phép, chứng chỉ hành nghề, nếu cá nhân, tổ chức vẫn tiến hành các hoạt động ghi trong giấy phép, chứng chỉ hành nghề thì bị xử phạt như hành vi không có giấy phép, chứng chỉ hành nghề."

5.5:
  code_name: 5
  full_name: "Trường hợp cá nhân, tổ chức vi phạm hành chính bị áp dụng hình thức xử phạt tước quyền sử dụng giấy phép, chứng chỉ hành nghề nhưng thời hạn sử dụng còn lại của giấy phép, chứng chỉ hành nghề đó ít hơn thời hạn bị tước thì người có thẩm quyền vẫn ra quyết định xử phạt có áp dụng hình thức tước quyền sử dụng giấy phép, chứng chỉ hành nghề theo quy định đối với hành vi vi phạm. Trong thời gian bị tước quyền sử dụng giấy phép, chứng chỉ hành nghề, cá nhân, tổ chức không được làm thủ tục cấp mới, đổi, cấp lại giấy phép, chứng chỉ hành nghề, trừ trường hợp quy định tại khoản 6 Điều này."

5.6:
  code_name: 6
  full_name: "Trường hợp tước quyền sử dụng giấy phép lái xe tích hợp giấy phép lái xe không thời hạn (xe mô tô, xe tương tự xe mô tô) và giấy phép lái xe có thời hạn (xe ô tô, xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ) thì người có thẩm quyền xử phạt áp dụng tước quyền sử dụng đối với giấy phép lái xe không thời hạn khi người điều khiển xe mô tô, xe tương tự xe mô tô hoặc tước quyền sử dụng đối với giấy phép lái xe có thời hạn khi người điều khiển xe ô tô, xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ thực hiện hành vi vi phạm hành chính có quy định bị tước quyền sử dụng giấy phép lái xe. Trong thời gian bị tước quyền sử dụng, người có giấy phép lái xe tích hợp được cấp, đổi giấy phép lái xe đối với giấy phép lái xe không bị tước quyền sử dụng."

5.7:
  code_name: 7
  full_name: "Trường hợp giấy phép, chứng chỉ hành nghề được cấp dưới dạng điện tử hoặc thể hiện dưới hình thức thông điệp dữ liệu thì cơ quan, người có thẩm quyền thực hiện tạm giữ, tước trên môi trường điện tử theo quy định nếu đáp ứng điều kiện về cơ sở hạ tầng, kỹ thuật, thông tin. Việc tạm giữ, tước quyền sử dụng được cập nhật trạng thái trên cơ sở dữ liệu, căn cước điện tử, tài khoản định danh điện tử và ứng dụng thông tin điện tử khác theo quy định."

II:
  code_name: II
  full_name: HÀNH VI VI PHẠM, HÌNH THỨC, MỨC XỬ PHẠT, MỨC TRỪ ĐIỂM GIẤY PHÉP LÁI XE VÀ BIỆN PHÁP KHẮC PHỤC HẬU QUẢ VI PHẠM HÀNH CHÍNH VỀ TRẬT TỰ, AN TOÀN GIAO THÔNG TRONG LĨNH VỰC GIAO THÔNG ĐƯỜNG BỘ

II.1:
  code_name: c
  full_name: "VI PHẠM QUY TẮC GIAO THÔNG ĐƯỜNG BỘ"

6:
  code_name: 6
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô vi phạm quy tắc giao thông đường bộ

6.1:
  code_name: 1
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.1.a:
  code_name: a
  full_name: "Không chấp hành hiệu lệnh, chỉ dẫn của biển báo hiệu, vạch kẻ đường, trừ các hành vi vi phạm quy định tại điểm a, điểm c, điểm d, điểm đ khoản 2; điểm a, điểm d, điểm đ, điểm e, điểm n, điểm o khoản 3; điểm a, điểm b, điểm đ, điểm e, điểm i, điểm k, điểm l khoản 4; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm i, điểm k khoản 5; điểm a khoản 6; khoản 7; điểm b, điểm d khoản 9; điểm a khoản 10; điểm đ khoản 11 Điều này;"

6.1.b:
  code_name: b
  full_name: "Khi ra, vào vị trí dừng xe, đỗ xe không có tín hiệu báo cho người điều khiển phương tiện khác biết;"

6.1.c:
  code_name: c
  full_name: "Không báo hiệu bằng đèn khẩn cấp hoặc không đặt biển cảnh báo “Chú ý xe đỗ” theo quy định trong trường hợp gặp sự cố kỹ thuật (hoặc bất khả kháng khác) buộc phải đỗ xe chiếm một phần đường xe chạy hoặc tại nơi không được phép đỗ xe, trừ hành vi vi phạm quy định tại điểm c khoản 7 Điều này;"

6.1.d:
  code_name: d
  full_name: "Không gắn biển báo hiệu ở phía trước xe kéo, phía sau xe được kéo; điều khiển xe kéo rơ moóc không có biển báo hiệu theo quy định;"

6.1.đ:
  code_name: đ
  full_name: "Sử dụng còi trong thời gian từ 22 giờ ngày hôm trước đến 05 giờ ngày hôm sau trong khu đông dân cư, khu vực cơ sở khám bệnh, chữa bệnh, trừ các xe ưu tiên đang đi làm nhiệm vụ theo quy định."

6.2:
  code_name: 2
  full_name: "Phạt tiền từ 600.000 đồng đến 800.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.2.a:
  code_name: a
  full_name: "Chuyển làn đường không đúng nơi cho phép hoặc không có tín hiệu báo trước hoặc chuyển làn đường không đúng quy định “mỗi lần chuyển làn đường chỉ được phép chuyển sang một làn đường liền kề”, trừ các hành vi vi phạm quy định tại điểm g khoản 5 Điều này;"

6.2.b:
  code_name: b
  full_name: "Chở người trên buồng lái quá số lượng quy định;"

6.2.c:
  code_name: c
  full_name: "Không tuân thủ các quy định về nhường đường tại nơi đường bộ giao nhau, trừ các hành vi vi phạm quy định tại điểm n, điểm o khoản 5 Điều này;"

6.2.d:
  code_name: d
  full_name: "Dừng xe, đỗ xe trên phần đường xe chạy ở đoạn đường ngoài đô thị nơi có lề đường rộng; dừng xe, đỗ xe không sát mép đường phía bên phải theo chiều đi ở nơi đường có lề đường hẹp hoặc không có lề đường; dừng xe, đỗ xe ngược với chiều lưu thông của làn đường; dừng xe, đỗ xe trên dải phân cách cố định ở giữa hai phần đường xe chạy; đỗ xe trên dốc không chèn bánh;"

6.2.đ:
  code_name: đ
  full_name: "Dừng xe không sát theo lề đường, vỉa hè phía bên phải theo chiều đi hoặc bánh xe gần nhất cách lề đường, vỉa hè quá 0,25 mét; dừng xe trên đường dành riêng cho xe buýt; dừng xe trên miệng cống thoát nước, miệng hầm của đường điện thoại, điện cao thế, chỗ dành riêng cho xe chữa cháy lấy nước; rời vị trí lái, tắt máy khi dừng xe (trừ trường hợp rời khỏi vị trí lái để đóng, mở cửa xe, xếp dỡ hàng hóa, kiểm tra kỹ thuật xe) hoặc rời vị trí lái khi dừng xe nhưng không sử dụng phanh đỗ xe (hoặc thực hiện biện pháp an toàn khác); dừng xe, đỗ xe không đúng vị trí quy định ở những đoạn có bố trí nơi dừng xe, đỗ xe; dừng xe, đỗ xe trên phần đường dành cho người đi bộ qua đường; dừng xe nơi có biển “Cấm dừng xe và đỗ xe”, trừ hành vi vi phạm quy định tại điểm đ khoản 4, điểm c khoản 7 Điều này."

6.3:
  code_name: 3
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.3.a:
  code_name: a
  full_name: "Điều khiển xe chạy quá tốc độ quy định từ 05 km/h đến dưới 10 km/h;"

6.3.b:
  code_name: b
  full_name: "Sử dụng còi, rú ga liên tục; sử dụng còi hơi, sử dụng đèn chiếu xa khi gặp người đi bộ qua đường hoặc khi đi trên đoạn đường qua khu dân cư có hệ thống chiếu sáng đang hoạt động hoặc khi gặp xe đi ngược chiều (trừ trường hợp dải phân cách có khả năng chống chói) hoặc khi chuyển hướng xe tại nơi đường giao nhau, trừ các xe ưu tiên đang đi làm nhiệm vụ theo quy định;"

6.3.c:
  code_name: c
  full_name: "Chuyển hướng không quan sát hoặc không bảo đảm khoảng cách an toàn với xe phía sau hoặc không giảm tốc độ hoặc không có tín hiệu báo hướng rẽ hoặc có tín hiệu báo hướng rẽ nhưng không sử dụng liên tục trong quá trình chuyển hướng (trừ trường hợp điều khiển xe đi theo hướng cong của đoạn đường bộ ở nơi đường không giao nhau cùng mức);"

6.3.d:
  code_name: d
  full_name: "Không tuân thủ các quy định về dừng xe, đỗ xe tại nơi đường bộ giao nhau cùng mức với đường sắt; dừng xe, đỗ xe trong phạm vi bảo vệ công trình đường sắt, phạm vi an toàn của đường sắt;"

6.3.đ:
  code_name: đ
  full_name: "Dừng xe, đỗ xe tại vị trí: nơi đường bộ giao nhau hoặc trong phạm vi 05 mét tính từ mép đường giao nhau; điểm đón, trả khách; trước cổng hoặc trong phạm vi 05 mét hai bên cổng trụ sở cơ quan, tổ chức có bố trí đường cho xe ra, vào; nơi phần đường có bề rộng chỉ đủ cho một làn xe cơ giới; che khuất biển báo hiệu đường bộ, đèn tín hiệu giao thông; nơi mở dải phân cách giữa; cách xe ô tô đang đỗ ngược chiều dưới 20 mét trên đường phố hẹp, dưới 40 mét trên đường có một làn xe cơ giới trên một chiều đường;"

6.3.e:
  code_name: e
  full_name: "Đỗ xe không sát theo lề đường, vỉa hè phía bên phải theo chiều đi hoặc bánh xe gần nhất cách lề đường, vỉa hè quá 0,25 mét; đỗ xe trên đường dành riêng cho xe buýt; đỗ xe trên miệng cống thoát nước, miệng hầm của đường điện thoại, điện cao thế, chỗ dành riêng cho xe chữa cháy lấy nước; đỗ, để xe ở vỉa hè trái quy định của pháp luật; đỗ xe nơi có biển “Cấm đỗ xe” hoặc biển “Cấm dừng xe và đỗ xe”, trừ hành vi vi phạm quy định tại điểm đ khoản 4, điểm c khoản 7 Điều này;"

6.3.g:
  code_name: g
  full_name: "Không sử dụng hoặc sử dụng không đủ đèn chiếu sáng trong thời gian từ 18 giờ ngày hôm trước đến 06 giờ ngày hôm sau hoặc khi có sương mù, khói, bụi, trời mưa, thời tiết xấu làm hạn chế tầm nhìn;"

6.3.h:
  code_name: h
  full_name: "Điều khiển xe ô tô kéo theo xe khác, vật khác (trừ trường hợp kéo theo một rơ moóc, sơ mi rơ moóc hoặc một xe ô tô, xe máy chuyên dùng khác khi xe này không tự chạy được); điều khiển xe ô tô đẩy xe khác, vật khác; điều khiển xe kéo rơ moóc, sơ mi rơ moóc kéo thêm rơ moóc hoặc xe khác, vật khác; không nối chắc chắn, an toàn giữa xe kéo và xe được kéo khi kéo nhau;"

6.3.i:
  code_name: i
  full_name: "Chở người trên xe được kéo, trừ người điều khiển;"

6.3.k:
  code_name: k
  full_name: "Không thắt dây đai an toàn khi điều khiển xe chạy trên đường;"

6.3.l:
  code_name: l
  full_name: "Chở người trên xe ô tô không thắt dây đai an toàn (tại vị trí có trang bị dây đai an toàn) khi xe đang chạy;"

6.3.m:
  code_name: m
  full_name: "Chở trẻ em dưới 10 tuổi và chiều cao dưới 1,35 mét trên xe ô tô ngồi cùng hàng ghế với người lái xe (trừ loại xe ô tô chỉ có một hàng ghế) hoặc không sử dụng thiết bị an toàn phù hợp cho trẻ em theo quy định;"

6.3.n:
  code_name: n
  full_name: "Chạy trong hầm đường bộ không sử dụng đèn chiếu sáng gần;"

6.3.o:
  code_name: o
  full_name: "Điều khiển xe chạy dưới tốc độ tối thiểu trên đoạn đường bộ có quy định tốc độ tối thiểu cho phép;"

6.3.p:
  code_name: p
  full_name: "Điều khiển xe chạy tốc độ thấp hơn các xe khác đi cùng chiều mà không đi về làn đường bên phải chiều đi của mình, trừ trường hợp các xe khác đi cùng chiều chạy quá tốc độ quy định."

6.4:
  code_name: 4
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.4.a:
  code_name: a
  full_name: "Điều khiển xe không đủ điều kiện đã thu phí theo hình thức điện tử tự động không dừng (xe không gắn thẻ đầu cuối) đi vào làn đường dành riêng thu phí theo hình thức điện tử tự động không dừng tại các trạm thu phí;"

6.4.b:
  code_name: b
  full_name: "Dừng xe, đỗ xe tại vị trí: bên trái đường một chiều hoặc bên trái (theo hướng lưu thông) của đường đôi; trên đoạn đường cong hoặc gần đầu dốc nơi tầm nhìn bị che khuất; trên cầu (trừ trường hợp tổ chức giao thông cho phép), gầm cầu vượt (trừ những nơi cho phép dừng xe, đỗ xe), song song với một xe khác đang dừng, đỗ, trừ hành vi vi phạm quy định tại điểm c khoản 7 Điều này;"

6.4.c:
  code_name: c
  full_name: "Không thực hiện biện pháp bảo đảm an toàn theo quy định khi xe ô tô bị hư hỏng ngay tại nơi đường bộ giao nhau cùng mức với đường sắt;"

6.4.d:
  code_name: d
  full_name: "Không nhường đường cho xe xin vượt khi có đủ điều kiện an toàn;"

6.4.đ:
  code_name: đ
  full_name: 'Lùi xe, quay đầu xe trong hầm đường bộ; dừng xe, đỗ xe trong hầm đường bộ không đúng nơi quy định; không có báo hiệu bằng đèn khẩn cấp, không đặt biển cảnh báo "Chú ý xe đỗ" (hoặc đèn cảnh báo) về phía sau xe khoảng cách đảm bảo an toàn khi dừng xe, đỗ xe trong hầm đường bộ trong trường hợp gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe;'

6.4.e:
  code_name: e
  full_name: "Lùi xe ở đường một chiều, đường có biển “Cấm đi ngược chiều”, khu vực cấm dừng, trên phần đường dành cho người đi bộ qua đường, nơi đường bộ giao nhau, nơi đường bộ giao nhau cùng mức với đường sắt, nơi tầm nhìn bị che khuất; lùi xe không quan sát hai bên, phía sau xe hoặc không có tín hiệu lùi xe, trừ hành vi vi phạm quy định tại điểm đ khoản 11 Điều này;"

6.4.g:
  code_name: g
  full_name: "Điều khiển xe có liên quan trực tiếp đến vụ tai nạn giao thông mà không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, trừ hành vi vi phạm quy định tại khoản 8 Điều này;"

6.4.h:
  code_name: h
  full_name: "Xe được quyền ưu tiên lắp đặt, sử dụng thiết bị phát tín hiệu ưu tiên không đúng quy định hoặc sử dụng thiết bị phát tín hiệu ưu tiên mà không có giấy phép của cơ quan có thẩm quyền cấp hoặc có giấy phép của cơ quan có thẩm quyền cấp nhưng không còn giá trị sử dụng theo quy định;"

6.4.i:
  code_name: i
  full_name: "Quay đầu xe ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu cầu, gầm cầu vượt, ngầm, tại nơi đường bộ giao nhau cùng mức với đường sắt, đường hẹp, đường dốc, đoạn đường cong tầm nhìn bị che khuất, trên đường một chiều, trừ khi có hiệu lệnh của người điều khiển giao thông hoặc chỉ dẫn của biển báo hiệu tạm thời hoặc tổ chức giao thông tại những khu vực này có bố trí nơi quay đầu xe;"

6.4.k:
  code_name: k
  full_name: "Quay đầu xe tại nơi có biển báo hiệu có nội dung cấm quay đầu đối với loại phương tiện đang điều khiển; điều khiển xe rẽ trái tại nơi có biển báo hiệu có nội dung cấm rẽ trái đối với loại phương tiện đang điều khiển; điều khiển xe rẽ phải tại nơi có biển báo hiệu có nội dung cấm rẽ phải đối với loại phương tiện đang điều khiển;"

6.4.l:
  code_name: l
  full_name: "Không giữ khoảng cách an toàn để xảy ra va chạm với xe chạy liền trước hoặc không giữ khoảng cách theo quy định của biển báo hiệu “Cự ly tối thiểu giữa hai xe”, trừ các hành vi vi phạm quy định tại điểm d khoản 5 Điều này."

6.5:
  code_name: 5
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.5.a:
  code_name: a
  full_name: "Vượt xe trong những trường hợp không được vượt, vượt xe tại đoạn đường có biển báo hiệu có nội dung cấm vượt (đối với loại phương tiện đang điều khiển); không có tín hiệu trước khi vượt hoặc có tín hiệu vượt xe nhưng không sử dụng trong suốt quá trình vượt xe; vượt bên phải xe khác trong trường hợp không được phép;"

6.5.b:
  code_name: b
  full_name: "Điều khiển xe không đi bên phải theo chiều đi của mình; đi không đúng phần đường hoặc làn đường quy định (làn cùng chiều hoặc làn ngược chiều) trừ hành vi quy định tại điểm a khoản 4 Điều này; điều khiển xe đi qua dải phân cách cố định ở giữa hai phần đường xe chạy;"

6.5.c:
  code_name: c
  full_name: "Tránh xe đi ngược chiều không đúng quy định (trừ hành vi vi phạm sử dụng đèn chiếu xa khi tránh xe đi ngược chiều quy định tại điểm b khoản 3 Điều này); không nhường đường cho xe đi ngược chiều theo quy định tại nơi đường hẹp, đường dốc, nơi có chướng ngại vật;"

6.5.d:
  code_name: d
  full_name: "Không tuân thủ quy định khi vào hoặc ra đường cao tốc; điều khiển xe chạy ở làn dừng xe khẩn cấp hoặc phần lề đường của đường cao tốc; không tuân thủ quy định về khoảng cách an toàn đối với xe chạy liền trước khi chạy trên đường cao tốc;"

6.5.đ:
  code_name: đ
  full_name: "Điều khiển xe chạy quá tốc độ quy định từ 10 km/h đến 20 km/h;"

6.5.e:
  code_name: e
  full_name: "Xe không được quyền ưu tiên lắp đặt, sử dụng thiết bị phát tín hiệu của xe được quyền ưu tiên;"

6.5.g:
  code_name: g
  full_name: "Chuyển làn đường không đúng nơi cho phép hoặc không có tín hiệu báo trước hoặc chuyển làn đường không đúng quy định “mỗi lần chuyển làn đường chỉ được phép chuyển sang một làn đường liền kề” khi chạy trên đường cao tốc;"

6.5.h:
  code_name: h
  full_name: "Dùng tay cầm và sử dụng điện thoại hoặc các thiết bị điện tử khác khi điều khiển phương tiện tham gia giao thông đang di chuyển trên đường bộ;"

6.5.i:
  code_name: i
  full_name: "Đi vào khu vực cấm, đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển, trừ các hành vi vi phạm quy định tại điểm d khoản 9, điểm đ khoản 11 Điều này, hành vi bị cấm đi vào công trình thủy lợi và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định;"

6.5.k:
  code_name: k
  full_name: "Dừng xe, đỗ xe, quay đầu xe trái quy định gây ùn tắc giao thông;"

6.5.l:
  code_name: l
  full_name: "Chuyển hướng không nhường quyền đi trước cho: người đi bộ, xe lăn của người khuyết tật qua đường tại nơi có vạch kẻ đường dành cho người đi bộ; xe thô sơ đang đi trên phần đường dành cho xe thô sơ;"

6.5.m:
  code_name: m
  full_name: "Chuyển hướng không nhường đường cho: các xe đi ngược chiều; người đi bộ, xe thô sơ đang qua đường tại nơi không có vạch kẻ đường cho người đi bộ;"

6.5.n:
  code_name: n
  full_name: "Không giảm tốc độ (hoặc dừng lại) và nhường đường khi điều khiển xe đi từ đường không ưu tiên ra đường ưu tiên, từ đường nhánh ra đường chính;"

6.5.o:
  code_name: o
  full_name: "Không giảm tốc độ và nhường đường cho xe đi đến từ bên phải tại nơi đường giao nhau không có báo hiệu đi theo vòng xuyến; không giảm tốc độ và nhường đường cho xe đi đến từ bên trái tại nơi đường giao nhau có báo hiệu đi theo vòng xuyến;"

6.5.p:
  code_name: p
  full_name: "Chở người trên thùng xe trái quy định; chở người trên nóc xe; để người đu bám ở cửa xe, bên ngoài thành xe khi xe đang chạy;"

6.5.q:
  code_name: q
  full_name: "Mở cửa xe, để cửa xe mở không bảo đảm an toàn."

6.6:
  code_name: 6
  full_name: "Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.6.a:
  code_name: a
  full_name: "Điều khiển xe chạy quá tốc độ quy định trên 20 km/h đến 35 km/h;"

6.6.b:
  code_name: b
  full_name: "Không nhường đường hoặc gây cản trở xe được quyền ưu tiên đang phát tín hiệu ưu tiên đi làm nhiệm vụ;"

6.6.c:
  code_name: c
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu hoặc chưa vượt quá 0,25 miligam/1 lít khí thở;"

6.6.d:
  code_name: d
  full_name: "Điều khiển xe đi trên vỉa hè, trừ trường hợp điều khiển xe đi qua vỉa hè để vào nhà, cơ quan."

6.7:
  code_name: 7
  full_name: "Phạt tiền từ 12.000.000 đồng đến 14.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.7.a:
  code_name: a
  full_name: "Điều khiển xe chạy quá tốc độ quy định trên 35 km/h;"

6.7.b:
  code_name: b
  full_name: "Điều khiển xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ đi vào đường cao tốc;"

6.7.c:
  code_name: c
  full_name: "Dừng xe, đỗ xe trên đường cao tốc không đúng nơi quy định; không có báo hiệu bằng đèn khẩn cấp khi gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe ở làn dừng xe khẩn cấp trên đường cao tốc; không có báo hiệu bằng đèn khẩn cấp, không đặt biển cảnh báo “Chú ý xe đỗ” (hoặc đèn cảnh báo) về phía sau xe khoảng cách tối thiểu 150 mét khi dừng xe, đỗ xe trong trường hợp gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe trên một phần làn đường xe chạy trên đường cao tốc."

6.8:
  code_name: 8
  full_name: "Phạt tiền từ 16.000.000 đồng đến 18.000.000 đồng đối với người điều khiển xe thực hiện hành vi vi phạm gây tai nạn giao thông không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, không ở lại hiện trường hoặc không đến trình báo ngay với cơ quan công an, Ủy ban nhân dân nơi gần nhất."

6.9:
  code_name: 9
  full_name: "Phạt tiền từ 18.000.000 đồng đến 20.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.9.a:
  code_name: a
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 50 miligam đến 80 miligam/100 mililít máu hoặc vượt quá 0,25 miligam đến 0,4 miligam/1 lít khí thở;"

6.9.b:
  code_name: b
  full_name: "Không chấp hành hiệu lệnh của đèn tín hiệu giao thông;"

6.9.c:
  code_name: c
  full_name: "Không chấp hành hiệu lệnh, hướng dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông;"

6.9.d:
  code_name: d
  full_name: 'Đi ngược chiều của đường một chiều, đi ngược chiều trên đường có biển "Cấm đi ngược chiều”, trừ các hành vi vi phạm quy định tại điểm đ khoản 11 Điều này và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định.'

"6.10":
  code_name: 10
  full_name: "Phạt tiền từ 20.000.000 đồng đến 22.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.10.a:
  code_name: a
  full_name: "Điều khiển xe không quan sát, giảm tốc độ hoặc dừng lại để bảo đảm an toàn theo quy định mà gây tai nạn giao thông; điều khiển xe chạy quá tốc độ quy định gây tai nạn giao thông; dừng xe, đỗ xe, quay đầu xe, lùi xe, tránh xe, vượt xe, chuyển hướng, chuyển làn đường không đúng quy định gây tai nạn giao thông; không đi đúng phần đường, làn đường, không giữ khoảng cách an toàn giữa hai xe theo quy định gây tai nạn giao thông hoặc đi vào đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển gây tai nạn giao thông, trừ các hành vi vi phạm quy định tại điểm đ khoản 11 Điều này;"

6.10.b:
  code_name: b
  full_name: "Vi phạm quy định tại một trong các điểm, khoản sau của Điều này mà gây tai nạn giao thông: điểm a, điểm b, điểm c, điểm d, điểm đ khoản 1; điểm c khoản 2; điểm b, điểm g, điểm h, điểm n, điểm o, điểm p, khoản 3; điểm a, điểm c, điểm d khoản 4; điểm c, điểm d, điểm e, điểm h, điểm n, điểm o, điểm q khoản 5; điểm b khoản 7; điểm b, điểm c, điểm d khoản 9 Điều này."

6.11:
  code_name: 11
  full_name: "Phạt tiền từ 30.000.000 đồng đến 40.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

6.11.a:
  code_name: a
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở;"

6.11.b:
  code_name: b
  full_name: "Không chấp hành yêu cầu kiểm tra về nồng độ cồn của người thi hành công vụ;"

6.11.c:
  code_name: c
  full_name: "Điều khiển xe trên đường mà trong cơ thể có chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng;"

6.11.d:
  code_name: d
  full_name: "Không chấp hành yêu cầu kiểm tra về chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng của người thi hành công vụ;"

6.11.đ:
  code_name: đ
  full_name: "Điều khiển xe đi ngược chiều trên đường cao tốc, lùi xe trên đường cao tốc, quay đầu xe trên đường cao tốc, trừ các xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định."

6.12:
  code_name: 12
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với người điều khiển xe thực hiện hành vi điều khiển xe lạng lách, đánh võng trên đường bộ; chạy quá tốc độ đuổi nhau trên đường bộ; dùng chân điều khiển vô lăng xe khi xe đang chạy trên đường bộ."

6.13:
  code_name: 13
  full_name: "Phạt tiền từ 50.000.000 đồng đến 70.000.000 đồng đối với người điều khiển xe thực hiện hành vi vi phạm quy định tại khoản 12 Điều này mà gây tai nạn giao thông."

6.14:
  code_name: 14
  full_name: "Tịch thu phương tiện đối với người điều khiển xe tái phạm hành vi điều khiển xe lạng lách, đánh võng quy định tại khoản 12 Điều này."

6.15:
  code_name: 15
  full_name: "Ngoài việc bị phạt tiền, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

6.15.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm e khoản 5 Điều này còn bị tịch thu thiết bị phát tín hiệu ưu tiên lắp đặt, sử dụng trái quy định;"

6.15.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 12 Điều này bị tước quyền sử dụng giấy phép lái xe từ 10 tháng đến 12 tháng;"

6.15.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b, điểm c, điểm d khoản 11; khoản 13; khoản 14 Điều này bị tước quyền sử dụng giấy phép lái xe từ 22 tháng đến 24 tháng."

6.16:
  code_name: 16
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

6.16.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm h, điểm i khoản 3; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm g khoản 4; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g, điểm i, điểm k, điểm n, điểm o khoản 5 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

6.16.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm h khoản 5; khoản 6; điểm b khoản 7; điểm b, điểm c, điểm d khoản 9 Điều này bị trừ điểm giấy phép lái xe 04 điểm;"

6.16.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm p khoản 5; điểm a, điểm c khoản 7; khoản 8 Điều này bị trừ điểm giấy phép lái xe 06 điểm;"

6.16.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 9, khoản 10, điểm đkhoản 11 Điều này bị trừ điểm giấy phép lái xe 10 điểm."

7:
  code_name: 7
  full_name: Xử phạt, trừ điểm giấy phép lái của người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy vi phạm quy tắc giao thông đường bộ

7.1:
  code_name: 1
  full_name: "Phạt tiền từ 200.000 đồng đến 400.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.1.a:
  code_name: a
  full_name: "Không chấp hành hiệu lệnh, chỉ dẫn của biển báo hiệu, vạch kẻ đường, trừ các hành vi vi phạm quy định tại điểm b, điểm d, điểm e khoản 2; điểm a, điểm c, điểm d, điểm h khoản 3; điểm a, điểm b, điểm c, điểm d khoản 4; điểm b, điểm d khoản 6; điểm a, điểm b, điểm c khoản 7; điểm a khoản 8; điểm b khoản 9; điểm a khoản 10 Điều này;"

7.1.b:
  code_name: b
  full_name: "Không có tín hiệu trước khi vượt hoặc có tín hiệu vượt xe nhưng không sử dụng trong suốt quá trình vượt xe;"

7.1.c:
  code_name: c
  full_name: "Lùi xe mô tô ba bánh không quan sát hai bên, phía sau xe hoặc không có tín hiệu lùi xe;"

7.1.d:
  code_name: d
  full_name: "Chở người ngồi trên xe sử dụng ô (dù);"

7.1.đ:
  code_name: đ
  full_name: "Không tuân thủ các quy định về nhường đường tại nơi đường giao nhau, trừ các hành vi vi phạm quy định tại điểm c, điểm d khoản 6 Điều này;"

7.1.e:
  code_name: e
  full_name: "Chuyển làn đường không đúng nơi cho phép hoặc không có tín hiệu báo trước hoặc chuyển làn đường không đúng quy định “mỗi lần chuyển làn đường chỉ được phép chuyển sang một làn đường liền kề”;"

7.1.g:
  code_name: g
  full_name: "Không sử dụng đèn chiếu sáng trong thời gian từ 18 giờ ngày hôm trước đến 06 giờ ngày hôm sau hoặc khi có sương mù, khói, bụi, trời mưa, thời tiết xấu làm hạn chế tầm nhìn;"

7.1.h:
  code_name: h
  full_name: "Tránh xe không đúng quy định; sử dụng đèn chiếu xa khi gặp người đi bộ qua đường hoặc khi đi trên đoạn đường qua khu dân cư có hệ thống chiếu sáng đang hoạt động hoặc khi gặp xe đi ngược chiều (trừ trường hợp dải phân cách có khả năng chống chói) hoặc khi chuyển hướng xe tại nơi đường giao nhau; không nhường đường cho xe đi ngược chiều theo quy định tại nơi đường hẹp, đường dốc, nơi có chướng ngại vật;"

7.1.i:
  code_name: i
  full_name: "Sử dụng còi trong thời gian từ 22 giờ ngày hôm trước đến 05 giờ ngày hôm sau trong khu đông dân cư, khu vực cơ sở khám bệnh, chữa bệnh, trừ các xe ưu tiên đang đi làm nhiệm vụ theo quy định;"

7.1.k:
  code_name: k
  full_name: "Điều khiển xe chạy dưới tốc độ tối thiểu trên đoạn đường bộ có quy định tốc độ tối thiểu cho phép."

7.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.2.a:
  code_name: a
  full_name: "Dừng xe, đỗ xe trên phần đường xe chạy ở đoạn đường ngoài đô thị nơi có lề đường;"

7.2.b:
  code_name: b
  full_name: "Điều khiển xe chạy quá tốc độ quy định từ 05 km/h đến dưới 10 km/h;"

7.2.c:
  code_name: c
  full_name: "Điều khiển xe chạy tốc độ thấp mà không đi bên phải phần đường xe chạy gây cản trở giao thông;"

7.2.d:
  code_name: d
  full_name: "Dừng xe, đỗ xe ở lòng đường gây cản trở giao thông; tụ tập từ 03 xe trở lên ở lòng đường, trong hầm đường bộ; đỗ, để xe ở lòng đường, vỉa hè trái phép;"

7.2.đ:
  code_name: đ
  full_name: "Xe không được quyền ưu tiên lắp đặt, sử dụng thiết bị phát tín hiệu của xe được quyền ưu tiên;"

7.2.e:
  code_name: e
  full_name: "Dừng xe, đỗ xe trên điểm đón, trả khách, nơi đường bộ giao nhau, trên phần đường dành cho người đi bộ qua đường; dừng xe nơi có biển “Cấm dừng xe và đỗ xe”; đỗ xe tại nơi có biển “Cấm đỗ xe” hoặc biển “Cấm dừng xe và đỗ xe”; không tuân thủ các quy định về dừng xe, đỗ xe tại nơi đường bộ giao nhau cùng mức với đường sắt; dừng xe, đỗ xe trong phạm vi hành lang an toàn giao thông đường sắt;"

7.2.g:
  code_name: g
  full_name: "Chở theo 02 người trên xe, trừ trường hợp chở người bệnh đi cấp cứu, trẻ em dưới 12 tuổi, người già yếu hoặc người khuyết tật, áp giải người có hành vi vi phạm pháp luật;"

7.2.h:
  code_name: h
  full_name: "Không đội “mũ bảo hiểm cho người đi mô tô, xe máy” hoặc đội “mũ bảo hiểm cho người đi mô tô, xe máy” không cài quai đúng quy cách khi điều khiển xe tham gia giao thông trên đường bộ;"

7.2.i:
  code_name: i
  full_name: "Chở người ngồi trên xe không đội “mũ bảo hiểm cho người đi mô tô, xe máy” hoặc đội “mũ bảo hiểm cho người đi mô tô, xe máy” không cài quai đúng quy cách, trừ trường hợp chở người bệnh đi cấp cứu, trẻ em dưới 06 tuổi, áp giải người có hành vi vi phạm pháp luật;"

7.2.k:
  code_name: k
  full_name: "Quay đầu xe tại nơi không được quay đầu xe, trừ hành vi vi phạm quy định tại điểm d khoản 4 Điều này."

7.3:
  code_name: 3
  full_name: "Phạt tiền từ 600.000 đồng đến 800.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.3.a:
  code_name: a
  full_name: "Chuyển hướng không quan sát hoặc không bảo đảm khoảng cách an toàn với xe phía sau hoặc không giảm tốc độ hoặc không có tín hiệu báo hướng rẽ hoặc có tín hiệu báo hướng rẽ nhưng không sử dụng liên tục trong quá trình chuyển hướng (trừ trường hợp điều khiển xe đi theo hướng cong của đoạn đường bộ ở nơi đường không giao nhau cùng mức); điều khiển xe rẽ trái tại nơi có biển báo hiệu có nội dung cấm rẽ trái đối với loại phương tiện đang điều khiển; điều khiển xe rẽ phải tại nơi có biển báo hiệu có nội dung cấm rẽ phải đối với loại phương tiện đang điều khiển;"

7.3.b:
  code_name: b
  full_name: "Chở theo từ 03 người trở lên trên xe;"

7.3.c:
  code_name: c
  full_name: "Dừng xe, đỗ xe trên cầu;"

7.3.d:
  code_name: d
  full_name: "Điều khiển xe không đi bên phải theo chiều đi của mình; đi không đúng phần đường, làn đường quy định (làn cùng chiều hoặc làn ngược chiều); điều khiển xe đi qua dải phân cách cố định ở giữa hai phần đường xe chạy;"

7.3.đ:
  code_name: đ
  full_name: "Vượt bên phải trong trường hợp không được phép;"

7.3.e:
  code_name: e
  full_name: "Người đang điều khiển xe hoặc chở người ngồi trên xe bám, kéo, đẩy xe khác, vật khác, dẫn dắt vật nuôi, mang vác vật cồng kềnh; chở người đứng trên yên, giá đèo hàng hoặc ngồi trên tay lái của xe;"

7.3.g:
  code_name: g
  full_name: "Điều khiển xe kéo theo xe khác, vật khác;"

7.3.h:
  code_name: h
  full_name: "Chạy trong hầm đường bộ không sử dụng đèn chiếu sáng gần;"

7.3.i:
  code_name: i
  full_name: "Không giữ khoảng cách an toàn để xảy ra va chạm với xe chạy liền trước hoặc không giữ khoảng cách theo quy định của biển báo hiệu “Cự ly tối thiểu giữa hai xe”;"

7.3.k:
  code_name: k
  full_name: "Điều khiển xe chạy dàn hàng ngang từ 03 xe trở lên;"

7.3.l:
  code_name: l
  full_name: "Xe được quyền ưu tiên lắp đặt, sử dụng thiết bị phát tín hiệu ưu tiên không đúng quy định hoặc sử dụng thiết bị phát tín hiệu ưu tiên mà không có giấy phép của cơ quan có thẩm quyền cấp hoặc có giấy phép của cơ quan có thẩm quyền cấp nhưng không còn giá trị sử dụng theo quy định."

7.4:
  code_name: 4
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.4.a:
  code_name: a
  full_name: "Điều khiển xe chạy quá tốc độ quy định từ 10 km/h đến 20 km/h;"

7.4.b:
  code_name: b
  full_name: "Dừng xe, đỗ xe trong hầm đường bộ không đúng nơi quy định;"

7.4.c:
  code_name: c
  full_name: "Vượt xe trong những trường hợp không được vượt, vượt xe tại đoạn đường có biển báo hiệu có nội dung cấm vượt đối với loại phương tiện đang điều khiển, trừ các hành vi vi phạm quy định tại điểm đ khoản 3 Điều này;"

7.4.d:
  code_name: d
  full_name: "Quay đầu xe trong hầm đường bộ;"

7.4.đ:
  code_name: đ
  full_name: "Người đang điều khiển xe sử dụng ô (dù), thiết bị âm thanh (trừ thiết bị trợ thính), dùng tay cầm và sử dụng điện thoại hoặc các thiết bị điện tử khác."

7.5:
  code_name: 5
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.5.a:
  code_name: a
  full_name: "Điều khiển xe có liên quan trực tiếp đến vụ tai nạn giao thông mà không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, trừ hành vi vi phạm quy định tại điểm c khoản 9 Điều này;"

7.5.b:
  code_name: b
  full_name: "Chuyển hướng không nhường quyền đi trước cho: người đi bộ, xe lăn của người khuyết tật qua đường tại nơi có vạch kẻ đường dành cho người đi bộ; xe thô sơ đang đi trên phần đường dành cho xe thô sơ;"

7.5.c:
  code_name: c
  full_name: "Chuyển hướng không nhường đường cho: các xe đi ngược chiều; người đi bộ, xe thô sơ đang qua đường tại nơi không có vạch kẻ đường cho người đi bộ."

7.6:
  code_name: 6
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.6.a:
  code_name: a
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu hoặc chưa vượt quá 0,25 miligam/1 lít khí thở;"

7.6.b:
  code_name: b
  full_name: "Đi vào khu vực cấm, đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển, trừ các hành vi vi phạm quy định tại điểm a, điểm b khoản 7 Điều này và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định;"

7.6.c:
  code_name: c
  full_name: "Không giảm tốc độ (hoặc dừng lại) và nhường đường khi điều khiển xe đi từ đường không ưu tiên ra đường ưu tiên, từ đường nhánh ra đường chính;"

7.6.d:
  code_name: d
  full_name: "Không giảm tốc độ và nhường đường cho xe đi đến từ bên phải tại nơi đường giao nhau không có báo hiệu đi theo vòng xuyến; không giảm tốc độ và nhường đường cho xe đi đến từ bên trái tại nơi đường giao nhau có báo hiệu đi theo vòng xuyến."

7.7:
  code_name: 7
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.7.a:
  code_name: a
  full_name: "Đi ngược chiều của đường một chiều, đi ngược chiều trên đường có biển “Cấm đi ngược chiều”, trừ hành vi vi phạm quy định tại điểm b khoản này và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định; điều khiển xe đi trên vỉa hè, trừ trường hợp điều khiển xe đi qua vỉa hè để vào nhà, cơ quan;"

7.7.b:
  code_name: b
  full_name: "Điều khiển xe đi vào đường cao tốc, trừ xe phục vụ việc quản lý, bảo trì đường cao tốc;"

7.7.c:
  code_name: c
  full_name: "Không chấp hành hiệu lệnh của đèn tín hiệu giao thông;"

7.7.d:
  code_name: d
  full_name: "Không chấp hành hiệu lệnh, hướng dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông;"

7.7.đ:
  code_name: đ
  full_name: "Không nhường đường hoặc gây cản trở xe được quyền ưu tiên đang phát tín hiệu ưu tiên đi làm nhiệm vụ."

7.8:
  code_name: 8
  full_name: "Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.8.a:
  code_name: a
  full_name: "Điều khiển xe chạy quá tốc độ quy định trên 20 km/h;"

7.8.b:
  code_name: b
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 50 miligam đến 80 miligam/100 mililít máu hoặc vượt quá 0,25 miligam đến 0,4 miligam/1 lít khí thở."

7.9:
  code_name: 9
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.9.a:
  code_name: a
  full_name: "Điều khiển xe lạng lách, đánh võng trên đường bộ; sử dụng chân chống hoặc vật khác quệt xuống đường khi xe đang chạy;"

7.9.b:
  code_name: b
  full_name: "Điều khiển xe thành nhóm từ 02 xe trở lên chạy quá tốc độ quy định;"

7.9.c:
  code_name: c
  full_name: "Gây tai nạn giao thông không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, không ở lại hiện trường hoặc không đến trình báo ngay với cơ quan công an, Ủy ban nhân dân nơi gần nhất;"

7.9.d:
  code_name: d
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở;"

7.9.đ:
  code_name: đ
  full_name: "Không chấp hành yêu cầu kiểm tra về nồng độ cồn của người thi hành công vụ;"

7.9.e:
  code_name: e
  full_name: "Điều khiển xe trên đường mà trong cơ thể có chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng;"

7.9.g:
  code_name: g
  full_name: "Không chấp hành yêu cầu kiểm tra về chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng của người thi hành công vụ;"

7.9.h:
  code_name: h
  full_name: "Ngồi phía sau vòng tay qua người ngồi trước để điều khiển xe, trừ trường hợp chở trẻ em dưới 06 tuổi ngồi phía trước;"

7.9.i:
  code_name: i
  full_name: "Điều khiển xe thành đoàn gây cản trở giao thông, trừ trường hợp được cơ quan có thẩm quyền cấp phép;"

7.9.k:
  code_name: k
  full_name: "Sử dụng còi, rú ga (nẹt pô) liên tục trong khu đông dân cư, khu vực cơ sở khám bệnh, chữa bệnh, trừ các xe ưu tiên đang đi làm nhiệm vụ theo quy định."

"7.10":
  code_name: 10
  full_name: "Phạt tiền từ 10.000.000 đồng đến 14.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.10.a:
  code_name: a
  full_name: "Điều khiển xe không quan sát, giảm tốc độ hoặc dừng lại để bảo đảm an toàn theo quy định mà gây tai nạn giao thông; điều khiển xe chạy quá tốc độ quy định gây tai nạn giao thông; đi vào đường cao tốc, dừng xe, đỗ xe, quay đầu xe, lùi xe, vượt xe, chuyển hướng, chuyển làn đường không đúng quy định gây tai nạn giao thông; không đi đúng phần đường, làn đường, không giữ khoảng cách an toàn giữa hai xe theo quy định gây tai nạn giao thông hoặc đi vào đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển, đi ngược chiều của đường một chiều, đi ngược chiều trên đường có biển “Cấm đi ngược chiều” gây tai nạn giao thông;"

7.10.b:
  code_name: b
  full_name: "Vi phạm quy định tại một trong các điểm, khoản sau của Điều này mà gây tai nạn giao thông: điểm a, điểm d, điểm đ, điểm g, điểm h, điểm i, điểm k khoản 1; điểm c, điểm đ, điểm g khoản 2; điểm b, điểm e, điểm g, điểm h, điểm k khoản 3; điểm đ khoản 4; điểm c, điểm d khoản 6; điểm c, điểm d, điểm đ khoản 7; điểm a, điểm b, điểm h, điểm k khoản 9 Điều này."

7.11:
  code_name: 11
  full_name: "Tịch thu phương tiện đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

7.11.a:
  code_name: a
  full_name: "Buông cả hai tay khi đang điều khiển xe; dùng chân điều khiển xe; ngồi về một bên điều khiển xe; nằm trên yên xe điều khiển xe; thay người điều khiển khi xe đang chạy; quay người về phía sau để điều khiển xe hoặc bịt mắt điều khiển xe;"

7.11.b:
  code_name: b
  full_name: "Điều khiển xe chạy bằng một bánh đối với xe hai bánh, chạy bằng hai bánh đối với xe ba bánh;"

7.11.c:
  code_name: c
  full_name: "Tái phạm hành vi điều khiển xe lạng lách, đánh võng quy định tại điểm a khoản 9 Điều này."

7.12:
  code_name: 12
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt chính, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

7.12.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm đ khoản 2 Điều này còn bị tịch thu thiết bị phát tín hiệu ưu tiên lắp đặt, sử dụng trái quy định;"

7.12.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b, điểm h, điểm i, điểm k khoản 9 Điều này bị tước quyền sử dụng giấy phép lái xe từ 10 tháng đến 12 tháng;"

7.12.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm d, điểm đ, điểm e, điểm g khoản 9; khoản 11 Điều này bị tước quyền sử dụng giấy phép lái xe từ 22 tháng đến 24 tháng."

7.13:
  code_name: 13
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

7.13.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 3; khoản 5; điểm b, điểm c, điểm d khoản 6; điểm a khoản 7 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

7.13.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm đ khoản 4; điểm a khoản 6; điểm c, điểm d, điểm đ khoản 7; điểm a khoản 8 Điều này bị trừ điểm giấy phép lái xe 04 điểm;"

7.13.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 7, điểm c khoản 9 Điều này bị trừ điểm giấy phép lái xe 06 điểm;"

7.13.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 8, khoản 10 Điều này bị trừ điểm giấy phép lái xe 10 điểm."

8:
  code_name: 8
  full_name: Xử phạt người điều khiển xe máy chuyên dùng vi phạm quy tắc giao thông đường bộ

8.1:
  code_name: 1
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.1.a:
  code_name: a
  full_name: "Không chấp hành hiệu lệnh, chỉ dẫn của biển báo hiệu, vạch kẻ đường, trừ các hành vi vi phạm quy định tại điểm a, điểm b, điểm c, điểm đ khoản 2; điểm a, điểm d, điểm đ khoản 3; khoản 4; điểm a, điểm c khoản 5; điểm a, điểm b, điểm d, điểm đ, điểm e, điểm i khoản 6; điểm c, điểm d khoản 7; điểm a, điểm b khoản 8; điểm đ khoản 9 Điều này;"

8.1.b:
  code_name: b
  full_name: "Không báo hiệu bằng đèn khẩn cấp hoặc không đặt biển cảnh báo “Chú ý xe đỗ” theo quy định trong trường hợp gặp sự cố kỹ thuật (hoặc bất khả kháng khác) buộc phải đỗ xe chiếm một phần đường xe chạy hoặc tại nơi không được phép đỗ xe, trừ hành vi vi phạm quy định tại điểm b khoản 6 Điều này."

8.2:
  code_name: 2
  full_name: "Phạt tiền từ 600.000 đồng đến 800.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.2.a:
  code_name: a
  full_name: "Dừng xe, đỗ xe trên phần đường xe chạy ở đoạn đường ngoài đô thị nơi có lề đường rộng; dừng xe, đỗ xe không sát mép đường phía bên phải theo chiều đi ở nơi đường có lề đường hẹp hoặc không có lề đường; dừng xe, đỗ xe ngược với chiều lưu thông của làn đường; dừng xe, đỗ xe trên dải phân cách cố định ở giữa hai phần đường xe chạy; dừng xe, đỗ xe không đúng vị trí quy định ở những đoạn đường đã có bố trí nơi dừng xe, đỗ xe; đỗ xe trên dốc không chèn bánh; dừng xe nơi có biển “Cấm dừng xe và đỗ xe”; đỗ xe nơi có biển “Cấm đỗ xe” hoặc biển “Cấm dừng xe và đỗ xe”, trừ hành vi vi phạm quy định tại điểm b khoản 6 Điều này;"

8.2.b:
  code_name: b
  full_name: "Dừng xe, đỗ xe tại các vị trí: bên trái đường một chiều hoặc bên trái (theo hướng lưu thông) của đường đôi; trên đoạn đường cong hoặc gần đầu dốc nơi tầm nhìn bị che khuất; trên cầu (trừ trường hợp tổ chức giao thông cho phép), gầm cầu vượt (trừ những nơi cho phép dừng xe, đỗ xe), song song với một xe khác đang dừng, đỗ; nơi đường bộ giao nhau hoặc trong phạm vi 05 mét tính từ mép đường giao nhau; điểm đón, trả khách; trước cổng hoặc trong phạm vi 05 mét hai bên cổng trụ sở cơ quan, tổ chức có bố trí đường cho xe ra, vào; nơi phần đường có bề rộng chỉ đủ cho một làn xe cơ giới; che khuất biển báo hiệu đường bộ, đèn tín hiệu giao thông; nơi mở dải phân cách giữa; cách xe ô tô đang đỗ ngược chiều dưới 20 mét trên đường phố hẹp, dưới 40 mét trên đường có một làn xe cơ giới trên một chiều đường, trừ hành vi vi phạm quy định tại điểm b khoản 6 Điều này;"

8.2.c:
  code_name: c
  full_name: "Dừng xe, đỗ xe ở lòng đường trái quy định; dừng xe, đỗ xe trên đường dành riêng cho xe buýt, trên miệng cống thoát nước, miệng hầm của đường điện thoại, điện cao thế, chỗ dành riêng cho xe chữa cháy lấy nước, trên phần đường dành cho người đi bộ qua đường; rời vị trí lái, tắt máy khi dừng xe (trừ trường hợp rời khỏi vị trí lái để đóng, mở cửa xe, xếp dỡ hàng hóa, kiểm tra kỹ thuật xe) hoặc rời vị trí lái khi dừng xe nhưng không sử dụng phanh đỗ xe (hoặc thực hiện biện pháp an toàn khác); mở cửa xe, để cửa xe mở không bảo đảm an toàn;"

8.2.d:
  code_name: d
  full_name: "Khi ra, vào vị trí dừng xe, đỗ xe không có tín hiệu báo cho người điều khiển phương tiện khác biết;"

8.2.đ:
  code_name: đ
  full_name: "Đỗ, để xe ở vỉa hè trái phép."

8.3:
  code_name: 3
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.3.a:
  code_name: a
  full_name: "Chạy quá tốc độ quy định từ 05 km/h đến dưới 10 km/h;"

8.3.b:
  code_name: b
  full_name: "Sử dụng còi, rú ga liên tục; sử dụng còi hơi, sử dụng đèn chiếu xa khi gặp người đi bộ qua đường hoặc khi đi trên đoạn đường qua khu dân cư có hệ thống chiếu sáng đang hoạt động hoặc khi gặp xe đi ngược chiều (trừ trường hợp dải phân cách có khả năng chống chói) hoặc khi chuyển hướng xe tại nơi đường giao nhau, trừ các xe ưu tiên đang đi làm nhiệm vụ theo quy định;"

8.3.c:
  code_name: c
  full_name: "Không sử dụng hoặc sử dụng không đủ đèn chiếu sáng trong thời gian từ 18 giờ ngày hôm trước đến 06 giờ ngày hôm sau hoặc khi có sương mù, khói, bụi, trời mưa, thời tiết xấu làm hạn chế tầm nhìn;"

8.3.d:
  code_name: d
  full_name: "Tránh xe, vượt xe không đúng quy định; không nhường đường cho xe đi ngược chiều theo quy định tại nơi đường hẹp, đường dốc, nơi có chướng ngại vật;"

8.3.đ:
  code_name: đ
  full_name: "Điều khiển xe chạy dưới tốc độ tối thiểu trên đoạn đường bộ có quy định tốc độ tối thiểu cho phép."

8.4:
  code_name: 4
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.4.a:
  code_name: a
  full_name: "Chạy quá tốc độ quy định từ 10 km/h đến 20 km/h;"

8.4.b:
  code_name: b
  full_name: "Chạy xe trong hầm đường bộ không sử dụng đèn chiếu sáng gần;"

8.4.c:
  code_name: c
  full_name: "Không tuân thủ các quy định về dừng xe, đỗ xe tại nơi đường bộ giao nhau cùng mức với đường sắt; dừng xe, đỗ xe trong phạm vi bảo vệ công trình đường sắt, phạm vi an toàn của đường sắt;"

8.4.d:
  code_name: d
  full_name: "Quay đầu xe tại nơi đường bộ giao nhau cùng mức với đường sắt; quay đầu xe tại nơi đường hẹp, đường dốc, đoạn đường cong tầm nhìn bị che khuất, nơi có biển báo hiệu có nội dung cấm quay đầu đối với loại phương tiện đang điều khiển; điều khiển xe rẽ trái tại nơi có biển báo hiệu có nội dung cấm rẽ trái đối với loại phương tiện đang điều khiển; điều khiển xe rẽ phải tại nơi có biển báo hiệu có nội dung cấm rẽ phải đối với loại phương tiện đang điều khiển;"

8.4.đ:
  code_name: đ
  full_name: "Quay đầu xe ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu cầu, ngầm, gầm cầu vượt, trừ khi có hiệu lệnh của người điều khiển giao thông hoặc chỉ dẫn của biển báo hiệu tạm thời hoặc tổ chức giao thông tại những khu vực này có bố trí nơi quay đầu xe;"

8.4.e:
  code_name: e
  full_name: "Lùi xe ở đường một chiều, đường có biển “Cấm đi ngược chiều”, khu vực cấm dừng, trên phần đường dành cho người đi bộ qua đường, nơi đường bộ giao nhau, đường bộ giao nhau cùng mức với đường sắt, nơi tầm nhìn bị che khuất; lùi xe không quan sát hai bên và phía sau xe hoặc không có tín hiệu lùi xe."

8.5:
  code_name: 5
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.5.a:
  code_name: a
  full_name: "Lùi xe, quay đầu xe trong hầm đường bộ;"

8.5.b:
  code_name: b
  full_name: "Không thực hiện biện pháp bảo đảm an toàn theo quy định khi phương tiện bị hư hỏng trên đoạn đường bộ giao nhau cùng mức với đường sắt;"

8.5.c:
  code_name: c
  full_name: "Dừng xe, đỗ xe trong hầm đường bộ không đúng nơi quy định; không có báo hiệu bằng đèn khẩn cấp, không đặt biển cảnh báo “Chú ý xe đỗ” (hoặc đèn cảnh báo) về phía sau xe khoảng cách đảm bảo an toàn khi dừng xe, đỗ xe trong hầm đường bộ trong trường hợp gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe;"

8.5.d:
  code_name: d
  full_name: "Điều khiển xe có liên quan trực tiếp đến vụ tai nạn giao thông mà không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, trừ hành vi vi phạm quy định tại điểm c khoản 8 Điều này;"

8.5.đ:
  code_name: đ
  full_name: "Chuyển hướng không nhường quyền đi trước cho: người đi bộ, xe lăn của người khuyết tật qua đường tại nơi có vạch kẻ đường dành cho người đi bộ; xe thô sơ đang đi trên phần đường dành cho xe thô sơ;"

8.5.e:
  code_name: e
  full_name: "Chuyển hướng không nhường đường cho: các xe đi ngược chiều; người đi bộ, xe thô sơ đang qua đường tại nơi không có vạch kẻ đường cho người đi bộ."

8.6:
  code_name: 6
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.6.a:
  code_name: a
  full_name: "Chạy quá tốc độ quy định trên 20 km/h;"

8.6.b:
  code_name: b
  full_name: "Dừng xe, đỗ xe trên đường cao tốc không đúng nơi quy định; không có báo hiệu bằng đèn khẩn cấp khi gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe ở làn dừng xe khẩn cấp trên đường cao tốc; không có báo hiệu bằng đèn khẩn cấp, không đặt biển cảnh báo “Chú ý xe đỗ” (hoặc đèn cảnh báo) về phía sau xe khoảng cách tối thiểu 150 mét khi gặp sự cố kỹ thuật hoặc bất khả kháng khác buộc phải dừng xe, đỗ xe trên một phần làn đường xe chạy trên đường cao tốc;"

8.6.c:
  code_name: c
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu hoặc chưa vượt quá 0,25 miligam/1 lít khí thở;"

8.6.d:
  code_name: d
  full_name: "Đi vào khu vực cấm, đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển, trừ các hành vi vi phạm quy định tại điểm d khoản 7, điểm đ khoản 9 Điều này và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định;"

8.6.đ:
  code_name: đ
  full_name: "Không đi bên phải theo chiều đi của mình; đi không đúng phần đường hoặc làn đường quy định (làn cùng chiều hoặc làn ngược chiều); điều khiển xe đi qua dải phân cách cố định ở giữa hai phần đường xe chạy, trừ các hành vi vi phạm quy định tại điểm e khoản 6, điểm d khoản 7, điểm đ khoản 9 Điều này;"

8.6.e:
  code_name: e
  full_name: "Không tuân thủ các quy định khi vào hoặc ra đường cao tốc; điều khiển xe chạy ở làn dừng xe khẩn cấp hoặc phần lề đường của đường cao tốc; không tuân thủ quy định về khoảng cách an toàn đối với xe chạy liền trước khi chạy trên đường cao tốc;"

8.6.g:
  code_name: g
  full_name: "Không nhường đường hoặc gây cản trở xe được quyền ưu tiên đang phát tín hiệu ưu tiên đi làm nhiệm vụ;"

8.6.h:
  code_name: h
  full_name: "Chuyển làn đường không đúng nơi cho phép hoặc không có tín hiệu báo trước khi chạy trên đường cao tốc hoặc chuyển làn đường không đúng quy định “mỗi lần chuyển làn đường chỉ được phép chuyển sang một làn đường liền kề”;"

8.6.i:
  code_name: i
  full_name: "Không giảm tốc độ (hoặc dừng lại) và nhường đường khi điều khiển xe đi từ đường không ưu tiên ra đường ưu tiên, từ đường nhánh ra đường chính."

8.7:
  code_name: 7
  full_name: "Phạt liền từ 6.000.000 đồng đến 8.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.7.a:
  code_name: a
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 50 miligam đến 80 miligam/100 mililít máu hoặc vượt quá 0,25 miligam đến 0,4 miligam/1 lít khí thở;"

8.7.b:
  code_name: b
  full_name: "Không chấp hành hiệu lệnh, hướng dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông;"

8.7.c:
  code_name: c
  full_name: "Không chấp hành hiệu lệnh của đèn tín hiệu giao thông;"

8.7.d:
  code_name: d
  full_name: "Đi ngược chiều của đường một chiều, đi ngược chiều trên đường có biển “Cấm đi ngược chiều”, trừ các hành vi vi phạm quy định tại điểm đ khoản 9 Điều này và các trường hợp xe ưu tiên đang đi làm nhiệm vụ khẩn cấp theo quy định."

8.8:
  code_name: 8
  full_name: "Phạt tiền từ 14.000.000 đồng đến 16.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.8.a:
  code_name: a
  full_name: "Điều khiển xe không quan sát, giảm tốc độ hoặc dừng lại để bảo đảm an toàn theo quy định mà gây tai nạn giao thông; điều khiển xe chạy quá tốc độ quy định gây tai nạn giao thông; dừng xe, đỗ xe, quay đầu xe, lùi xe, tránh xe, vượt xe, chuyển hướng, chuyển làn đường không đúng quy định gây tai nạn giao thông; mở cửa xe, để cửa xe mở không bảo đảm an toàn gây tai nạn giao thông; không đi đúng phần đường, làn đường, không giữ khoảng cách an toàn giữa hai xe theo quy định gây tai nạn giao thông hoặc đi vào đường có biển báo hiệu có nội dung cấm đi vào đối với loại phương tiện đang điều khiển, đi ngược chiều của đường một chiều, đi ngược chiều trên đường có biển “Cấm đi ngược chiều” gây tai nạn giao thông, trừ các hành vi vi phạm quy định tại điểm b khoản 8, điểm đ khoản 9 Điều này;"

8.8.b:
  code_name: b
  full_name: "Điều khiển xe máy chuyên dùng có tốc độ thiết kế nhỏ hơn tốc độ tối thiểu quy định đối với đường cao tốc đi vào đường cao tốc, trừ phương tiện, thiết bị phục vụ việc quản lý, bảo trì đường cao tốc;"

8.8.c:
  code_name: c
  full_name: "Gây tai nạn giao thông không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, không ở lại hiện trường hoặc không đến trình báo ngay với cơ quan công an, Ủy ban nhân dân nơi gần nhất;"

8.8.d:
  code_name: d
  full_name: "Vi phạm quy định tại một trong các điểm, khoản sau của Điều này mà gây tai nạn giao thông: điểm a, điểm b khoản 1; điểm d khoản 2; điểm b, điểm c, điểm d, điểm đ khoản 3; điểm b khoản 4; điểm b khoản 5; điểm e, điểm g, điểm i khoản 6; điểm b, điểm c khoản 7 Điều này."

8.9:
  code_name: 9
  full_name: "Phạt tiền từ 18.000.000 đồng đến 20.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

8.9.a:
  code_name: a
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở;"

8.9.b:
  code_name: b
  full_name: "Không chấp hành yêu cầu kiểm tra về nồng độ cồn của người thi hành công vụ;"

8.9.c:
  code_name: c
  full_name: "Điều khiển xe trên đường mà trong cơ thể có chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng;"

8.9.d:
  code_name: d
  full_name: "Không chấp hành yêu cầu kiểm tra về chất ma túy hoặc chất kích thích khác mà pháp luật cấm sử dụng của người thi hành công vụ;"

8.9.đ:
  code_name: đ
  full_name: "Lùi xe trên đường cao tốc; đi ngược chiều trên đường cao tốc; quay đầu xe trên đường cao tốc;"

8.9.e:
  code_name: e
  full_name: "Vi phạm quy định tại điểm b khoản 8 Điều này mà gây tai nạn giao thông."

9:
  code_name: 9
  full_name: Xử phạt người điều khiển xe đạp, xe đạp máy, người điều khiển xe thô sơ khác vi phạm quy tắc giao thông đường bộ

9.1:
  code_name: 1
  full_name: "Phạt tiền từ 100.000 đồng đến 200.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

9.1.a:
  code_name: a
  full_name: "Không đi bên phải theo chiều đi của mình, đi không đúng phần đường quy định;"

9.1.b:
  code_name: b
  full_name: "Dừng xe đột ngột; chuyển hướng không báo hiệu trước;"

9.1.c:
  code_name: c
  full_name: "Không chấp hành hiệu lệnh hoặc chỉ dẫn của biển báo hiệu, vạch kẻ đường, trừ các hành vi vi phạm quy định tại điểm đ khoản 2, điểm c khoản 3 Điều này;"

9.1.d:
  code_name: d
  full_name: "Vượt bên phải trong các trường hợp không được phép;"

9.1.đ:
  code_name: đ
  full_name: "Dừng xe, đỗ xe trên phần đường xe chạy ở đoạn đường ngoài đô thị nơi có lề đường;"

9.1.e:
  code_name: e
  full_name: "Chạy trong hầm đường bộ không bật đèn hoặc không có vật phát sáng báo hiệu; dừng xe, đỗ xe trong hầm đường bộ không đúng nơi quy định; quay đầu xe trong hầm đường bộ;"

9.1.g:
  code_name: g
  full_name: "Điều khiển xe đạp, xe đạp máy đi dàn hàng ngang từ 03 xe trở lên, xe thô sơ khác đi dàn hàng ngang từ 02 xe trở lên;"

9.1.h:
  code_name: h
  full_name: "Người điều khiển xe đạp, xe đạp máy sử dụng ô (dù), dùng tay cầm và sử dụng điện thoại hoặc các thiết bị điện tử khác; chở người ngồi trên xe đạp, xe đạp máy sử dụng ô (dù);"

9.1.i:
  code_name: i
  full_name: "Điều khiển xe thô sơ trong thời gian từ 18 giờ ngày hôm trước đến 06 giờ ngày hôm sau không sử dụng đèn hoặc không có báo hiệu ở phía trước và phía sau xe;"

9.1.k:
  code_name: k
  full_name: "Để xe ở lòng đường, vỉa hè trái phép; đỗ xe ở lòng đường gây cản trở giao thông, đỗ xe trên cầu gây cản trở giao thông;"

9.1.l:
  code_name: l
  full_name: "Không tuân thủ các quy định về dừng xe, đỗ xe tại nơi đường bộ giao nhau cùng mức với đường sắt;"

9.1.m:
  code_name: m
  full_name: "Dùng xe đẩy làm quầy hàng lưu động trên đường gây cản trở giao thông;"

9.1.n:
  code_name: n
  full_name: "Không giảm tốc độ (hoặc dừng lại) và nhường đường khi điều khiển xe đi từ đường không ưu tiên ra đường ưu tiên, từ đường nhánh ra đường chính;"

9.1.o:
  code_name: o
  full_name: "Xe đạp, xe đạp máy, xe xích lô chở quá số người quy định, trừ trường hợp chở người bệnh đi cấp cứu;"

9.1.p:
  code_name: p
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu hoặc chưa vượt quá 0,25 miligam/1 lít khí thở."

9.2:
  code_name: 2
  full_name: "Phạt tiền từ 150.000 đồng đến 250.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

9.2.a:
  code_name: a
  full_name: "Điều khiển xe đạp, xe đạp máy buông cả hai tay; chuyển hướng đột ngột trước đầu xe cơ giới đang chạy; dùng chân điều khiển xe đạp, xe đạp máy;"

9.2.b:
  code_name: b
  full_name: "Không chấp hành hiệu lệnh, chỉ dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông;"

9.2.c:
  code_name: c
  full_name: "Người đang điều khiển xe hoặc chở người ngồi trên xe bám, kéo, đẩy xe khác, vật khác, mang vác vật cồng kềnh; điều khiển xe kéo theo xe khác, vật khác;"

9.2.d:
  code_name: d
  full_name: "Không nhường đường cho xe xin vượt khi có đủ điều kiện an toàn hoặc gây cản trở đối với xe cơ giới xin vượt, gây cản trở xe ưu tiên;"

9.2.đ:
  code_name: đ
  full_name: "Không chấp hành hiệu lệnh của đèn tín hiệu giao thông."

9.3:
  code_name: 3
  full_name: "Phạt tiền từ 300.000 đồng đến 400.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

9.3.a:
  code_name: a
  full_name: "Điều khiển xe lạng lách, đánh võng; đuổi nhau trên đường;"

9.3.b:
  code_name: b
  full_name: "Đi xe bằng một bánh đối với xe đạp, xe đạp máy; đi xe bằng hai bánh đối với xe xích lô;"

9.3.c:
  code_name: c
  full_name: 'Đi vào khu vực cấm, đường có biển báo hiệu nội dung cấm đi vào đối với loại phương tiện đang điều khiển; đi ngược chiều đường của đường một chiều, đường có biển “Cấm đi ngược chiều";'

9.3.d:
  code_name: d
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 50 miligam đến 80 miligam/100 mililít máu hoặc vượt quá 0,25 miligam đến 0,4 miligam/1 lít khí thở."

9.4:
  code_name: 4
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

9.4.a:
  code_name: a
  full_name: "Gây tai nạn giao thông không dừng ngay phương tiện, không giữ nguyên hiện trường, không trợ giúp người bị nạn, không ở lại hiện trường hoặc không đến trình báo ngay với cơ quan công an, Ủy ban nhân dân nơi gần nhất;"

9.4.b:
  code_name: b
  full_name: "Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở;"

9.4.c:
  code_name: c
  full_name: "Không chấp hành yêu cầu kiểm tra về nồng độ cồn của người thi hành công vụ;"

9.4.d:
  code_name: d
  full_name: "Người điều khiển xe đạp máy không đội “mũ bảo hiểm cho người đi mô tô, xe máy” hoặc đội “mũ bảo hiểm cho người đi mô tô, xe máy” không cài quai đúng quy cách khi tham gia giao thông trên đường bộ;"

9.4.đ:
  code_name: đ
  full_name: "Chở người ngồi trên xe đạp máy không đội “mũ bảo hiểm cho người đi mô tô, xe máy” hoặc đội “mũ bảo hiểm cho người đi mô tô, xe máy” không cài quai đúng quy cách, trừ trường hợp chở người bệnh đi cấp cứu, trẻ em dưới 06 tuổi, áp giải người có hành vi vi phạm pháp luật."

9.5:
  code_name: 5
  full_name: "Phạt tiền từ 800.000 đồng đến 1.200.000 đồng đối với người điều khiển xe đi vào đường cao tốc, trừ phương tiện phục vụ việc quản lý, bảo trì đường cao tốc."

10:
  code_name: 10
  full_name: Xử phạt người đi bộ vi phạm quy tắc giao thông đường bộ

10.1:
  code_name: 1
  full_name: "Phạt tiền từ 150.000 đồng đến 250.000 đồng đối với người đi bộ thực hiện một trong các hành vi vi phạm sau đây:"

10.1.a:
  code_name: a
  full_name: "Không đi đúng phần đường quy định; vượt qua dải phân cách; đi qua đường không đúng nơi quy định; đi qua đường không có tín hiệu bằng tay theo quy định;"

10.1.b:
  code_name: b
  full_name: "Không chấp hành hiệu lệnh hoặc chỉ dẫn của đèn tín hiệu, biển báo hiệu, vạch kẻ đường, trừ hành vi vi phạm quy định tại điểm a khoản 2 Điều này;"

10.1.c:
  code_name: c
  full_name: "Không chấp hành hiệu lệnh, hướng dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông."

10.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người đi bộ thực hiện một trong các hành vi vi phạm sau đây:"

10.2.a:
  code_name: a
  full_name: "Đi vào đường cao tốc, trừ người phục vụ việc quản lý, bảo trì đường cao tốc;"

10.2.b:
  code_name: b
  full_name: "Mang, vác vật cồng kềnh gây cản trở giao thông;"

10.2.c:
  code_name: c
  full_name: "Đu, bám vào phương tiện giao thông đang chạy."

11:
  code_name: 11
  full_name: Xử phạt người điều khiển, dẫn dắt vật nuôi, điều khiển xe vật nuôi kéo vi phạm quy tắc giao thông đường bộ

11.1:
  code_name: 1
  full_name: "Phạt tiền từ 150.000 đồng đến 250.000 đồng đối với một trong các hành vi vi phạm sau đây:"

11.1.a:
  code_name: a
  full_name: "Không nhường đường theo quy định, không báo hiệu bằng tay khi chuyển hướng;"

11.1.b:
  code_name: b
  full_name: "Không chấp hành hiệu lệnh hoặc chỉ dẫn của đèn tín hiệu, biển báo hiệu, vạch kẻ đường, trừ hành vi vi phạm quy định tại khoản 3 Điều này;"

11.1.c:
  code_name: c
  full_name: "Không đủ dụng cụ đựng chất thải của vật nuôi hoặc không dọn sạch chất thải của vật nuôi thải ra đường, vỉa hè;"

11.1.d:
  code_name: d
  full_name: "Để vật nuôi đi trên đường bộ không bảo đảm an toàn cho người, phương tiện đang tham gia giao thông;"

11.1.đ:
  code_name: đ
  full_name: "Đi dàn hàng ngang từ 02 xe trở lên;"

11.1.e:
  code_name: e
  full_name: "Để vật nuôi kéo xe mà không có người điều khiển;"

11.1.g:
  code_name: g
  full_name: "Điều khiển xe không có báo hiệu theo quy định."

11.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:"

11.2.a:
  code_name: a
  full_name: "Không chấp hành hiệu lệnh, hướng dẫn của người điều khiển giao thông hoặc người kiểm soát giao thông;"

11.2.b:
  code_name: b
  full_name: "Dẫn dắt vật nuôi chạy theo khi đang điều khiển hoặc ngồi trên phương tiện giao thông đường bộ;"

11.2.c:
  code_name: c
  full_name: "Điều khiển, dẫn dắt vật nuôi đi không đúng phần đường quy định, đi vào đường cấm, khu vực cấm, đi vào phần đường của xe cơ giới."

11.3:
  code_name: 3
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với người điều khiển, dẫn dắt vật nuôi, điều khiển xe vật nuôi kéo đi vào đường cao tốc."

12:
  code_name: 12
  full_name: Xử phạt, trừ điểm giấy phép lái xe các hành vi vi phạm khác về quy tắc giao thông đường bộ; sử dụng lòng đường, vỉa hè vào mục đích khác

12.1:
  code_name: 1
  full_name: "Phạt tiền từ 100.000 đồng đến 200.000 đồng đối với người được chở trên xe đạp, xe đạp máy sử dụng ô (dù)."

12.2:
  code_name: 2
  full_name: "Phạt tiền từ 200.000 đồng đến 250.000 đồng đối với cá nhân thực hiện một trong các hành vi vi phạm sau đây:"

12.2.a:
  code_name: a
  full_name: "Tập trung đông người trái phép, nằm, ngồi trên đường bộ gây cản trở giao thông;"

12.2.b:
  code_name: b
  full_name: "Đá bóng, đá cầu, chơi cầu lông hoặc các hoạt động thể thao khác trái phép trên đường bộ; sử dụng bàn trượt, pa-tanh, các thiết bị tương tự trên phần đường xe chạy;"

12.2.c:
  code_name: c
  full_name: "Điều khiển vật thể bay, tàu bay không người lái, phương tiện bay siêu nhẹ hoạt động trong phạm vi khổ giới hạn đường bộ gây cản trở hoặc nguy cơ mất an toàn cho người, phương tiện tham gia giao thông đường bộ, trừ tàu bay không người lái, phương tiện bay siêu nhẹ được cấp phép bay;"

12.2.d:
  code_name: d
  full_name: "Người được chở trên xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy sử dụng ô (dù);"

12.2.đ:
  code_name: đ
  full_name: "Người được chở trên xe đạp, xe đạp máy bám, kéo, đẩy xe khác, vật khác, mang vác vật cồng kềnh;"

12.2.e:
  code_name: e
  full_name: "Bán hàng rong hoặc bán hàng hóa nhỏ lẻ khác trên lòng đường, trên vỉa hè các tuyến phố có quy định cấm bán hàng; trừ các hành vi vi phạm quy định tại khoản 7, khoản 9 Điều này;"

12.2.g:
  code_name: g
  full_name: "Phơi thóc, lúa, rơm, rạ, nông, lâm, hải sản trên đường bộ; đặt máy tuốt lúa trên đường bộ."

12.3:
  code_name: 3
  full_name: "Phạt tiền từ 250.000 đồng đến 350.000 đồng đối với cá nhân, từ 500.000 đồng đến 700.000 đồng đối với tổ chức để vật che khuất biển báo hiệu đường bộ, đèn tín hiệu giao thông."

12.4:
  code_name: 4
  full_name: "Phạt tiền từ 350.000 đồng đến 400.000 đồng đối với người được chở trên xe ô tô không thắt dây đai an toàn (tại vị trí có trang bị dây đai an toàn) khi xe đang chạy."

12.5:
  code_name: 5
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người được chở trên xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

12.5.a:
  code_name: a
  full_name: "Bám, kéo, đẩy xe khác, vật khác, dẫn dắt vật nuôi, mang vác vật cồng kềnh, đứng trên yên, giá đèo hàng hoặc ngồi trên tay lái của xe;"

12.5.b:
  code_name: b
  full_name: "Không đội “mũ bảo hiểm cho người đi mô tô, xe máy” hoặc đội “mũ bảo hiểm cho người đi mô tô, xe máy” không cài quai đúng quy cách khi tham gia giao thông trên đường bộ."

12.6:
  code_name: 6
  full_name: "Phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với cá nhân, từ 1.000.000 đồng đến 2.000.000 đồng đối với tổ chức thực hiện một trong các hành vi vi phạm sau đây:"

12.6.a:
  code_name: a
  full_name: "Khi có điều kiện mà cố ý không cứu giúp người bị tai nạn giao thông đường bộ;"

12.6.b:
  code_name: b
  full_name: "Lợi dụng việc xảy ra tai nạn giao thông đường bộ để hành hung, đe dọa, xúi giục, gây sức ép, làm mất trật tự, cản trở việc xử lý tai nạn giao thông đường bộ;"

12.6.c:
  code_name: c
  full_name: "Cản trở người, phương tiện tham gia giao thông trên đường bộ; ném gạch, đất, đá, cát hoặc vật thể khác vào người, phương tiện đang tham gia giao thông trên đường bộ;"

12.6.d:
  code_name: d
  full_name: "Chiếm dụng dải phân cách giữa của đường đôi làm nơi: bày, bán hàng hóa; để vật liệu xây dựng; để xe, trông, giữ xe."

12.7:
  code_name: 7
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với cá nhân, từ 4.000.000 đồng đến 6.000.000 đồng đối với tổ chức thực hiện hành vi sử dụng trái phép lòng đường, vỉa hè để: họp chợ; kinh doanh dịch vụ ăn uống; bày, bán hàng hóa; sửa chữa phương tiện, máy móc, thiết bị; rửa xe; đặt, treo biển hiệu, biển quảng cáo."

12.8:
  code_name: 8
  full_name: "Phạt tiền từ 2.000.000 đồng đến 4.000.000 đồng đối với cá nhân, từ 4.000.000 đồng đến 8.000.000 đồng đối với tổ chức cố ý thay đổi, xóa dấu vết hiện trường vụ tai nạn giao thông, trừ các hành vi vi phạm quy định tại điểm g khoản 4, khoản 8 Điều 6; điểm b khoản 5, điểm c khoản 9 Điều 7; điểm d khoản 5, điểm c khoản 8 Điều 8; điểm a khoản 4 Điều 9 của Nghị định này."

12.9:
  code_name: 9
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với cá nhân, từ 6.000.000 đồng đến 10.000.000 đồng đối với tổ chức thực hiện hành vi bày, bán máy móc, thiết bị, vật tư hoặc sản xuất, gia công hàng hóa trên lòng đường, vỉa hè,"

"12.10":
  code_name: 10
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 8.000.000 đồng đến 12.000.000 đồng đối với tổ chức thực hiện hành vi không chấp hành yêu cầu kiểm tra, kiểm soát của người thi hành công vụ về bảo đảm trật tự, an toàn giao thông đường bộ, trừ các hành vi vi phạm quy định tại điểm b, điểm d khoản 11 Điều 6; điểm đ, điểm g khoản 9 Điều 7; điểm b, điểm d khoản 9 Điều 8; điểm c khoản 4 Điều 9; điểm b khoản 5 Điều 34 của Nghị định này."

12.11:
  code_name: 11
  full_name: "Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với cá nhân thực hiện một trong các hành vi vi phạm sau đây:"

12.11.a:
  code_name: a
  full_name: "Đặt, để chướng ngại vật, vật cản khác trái phép trên đường bộ; đổ chất gây trơn trượt trên đường bộ; đổ, xả thải, làm rơi vãi hóa chất, chất thải gây mất an toàn giao thông đường bộ;"

12.11.b:
  code_name: b
  full_name: "Xâm phạm tính mạng, sức khỏe, tài sản của người bị nạn, người gây tai nạn giao thông đường bộ hoặc người giúp đỡ, cứu chữa, đưa người bị nạn đi cấp cứu;"

12.11.c:
  code_name: c
  full_name: "Hủy hoại, làm hư hỏng, làm mất tác dụng thiết bị điều khiển, giám sát giao thông đường bộ, thiết bị thông minh hỗ trợ chỉ huy, điều khiển giao thông đường bộ."

12.12:
  code_name: 12
  full_name: "Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với cá nhân, từ 20.000.000 đồng đến 30.000.000 đồng đối với tổ chức thực hiện hành vi sử dụng tạm thời lòng đường, vỉa hè vào mục đích khác (theo quy định phải có giấy phép) mà không có giấy phép hoặc có giấy phép nhưng đã hết giá trị sử dụng hoặc thực hiện không đúng nội dung ghi trong giấy phép."

12.13:
  code_name: 13
  full_name: "Phạt tiền từ 30.000.000 đồng đến 32.000.000 đồng đối với cá nhân, từ 60.000.000 đồng đến 64.000.000 đồng đối với tổ chức thực hiện hành vi không khai báo, khai báo gian dối hoặc cung cấp thông tin, tài liệu không đúng sự thật để trốn tránh trách nhiệm khi bị phát hiện vi phạm pháp luật về trật tự, an toàn giao thông đường bộ."

12.14:
  code_name: 14
  full_name: "Phạt tiền từ 35.000.000 đồng đến 37.000.000 đồng đối với cá nhân thực hiện một trong các hành vi vi phạm sau đây:"

12.14.a:
  code_name: a
  full_name: "Xúc phạm, đe dọa, cản trở, chống đối người thi hành công vụ về bảo đảm trật tự, an toàn giao thông đường bộ;"

12.14.b:
  code_name: b
  full_name: "Rải vật sắc nhọn trên đường bộ."

12.15:
  code_name: 15
  full_name: "Ngoài việc bị phạt tiền, cá nhân thực hiện hành vi quy định tại khoản 14 Điều này nếu là người điều khiển phương tiện còn bị áp dụng hình thức xử phạt bổ sung tước quyền sử dụng giấy phép lát xe từ 22 tháng đến 24 tháng."

12.16:
  code_name: 16
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng các biện pháp khắc phục hậu quả sau đây:"

12.16.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 3 Điều này buộc phá dỡ các vật che khuất biển báo hiệu đường bộ, đèn tín hiệu giao thông;"

12.16.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 12 Điều này buộc khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra."

12.17:
  code_name: 17
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân thực hiện hành vi quy định tại điểm a, điểm b khoản 11 Điều này nếu là người điều khiển phương tiện bị trừ điểm giấy phép lái xe 02 điểm."

II.2:
  code_name: c
  full_name: "VI PHẠM QUY ĐỊNH VỀ PHƯƠNG TIỆN THAM GIA GIAO THÔNG ĐƯỜNG BỘ"

13:
  code_name: 13
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô (bao gồm cả rơ moóc hoặc sơ mi rơ moóc được kéo theo), xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tư xe ô tô vi phạm quy định về điều kiện của phương tiện khi tham gia giao thông

13.1:
  code_name: 1
  full_name: "Phạt tiền từ 200.000 đồng đến 400.000 đồng đối với hành vi điều khiển xe không có kính chắn gió hoặc có nhưng vỡ không có tác dụng (đối với xe có thiết kế lắp kính chắn gió)."

13.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.2.a:
  code_name: a
  full_name: "Điều khiển xe không có đủ đèn chiếu sáng, đèn soi biển số, đèn báo hãm, đèn tín hiệu, cần gạt nước, gương chiếu hậu, dây đai an toàn, dụng cụ thoát hiểm, thiết bị chữa cháy, đồng hồ báo áp lực hơi, đồng hồ báo tốc độ của xe hoặc có những thiết bị đó nhưng không có tác dụng, không đúng tiêu chuẩn thiết kế (đối với loại xe được quy định phải có những thiết bị đó), trừ các hành vi vi phạm quy định tại điểm h khoản 3 Điều 20, điểm d khoản 4 Điều 26 của Nghị định này;"

13.2.b:
  code_name: b
  full_name: "Điều khiển xe không có còi hoặc có nhưng còi không có tác dụng;"

13.2.c:
  code_name: c
  full_name: "Điều khiển xe không có bộ phận giảm thanh, giảm khói hoặc có nhưng không có tác dụng, không bảo đảm quy chuẩn môi trường về khí thải, tiếng ồn."

13.3:
  code_name: 3
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.3.a:
  code_name: a
  full_name: "Điều khiển xe lắp thêm đèn phía trước, phía sau, trên nóc, dưới gầm, một hoặc cả hai bên thành xe, trừ đèn sương mù dạng rời được lấp theo quy định;"

13.3.b:
  code_name: b
  full_name: "Điều khiển xe có hệ thống chuyển hướng của xe không đúng tiêu chuẩn an toàn kỹ thuật;"

13.3.c:
  code_name: c
  full_name: "Điều khiển xe không lắp đủ bánh lốp hoặc lắp bánh lốp không đúng kích cỡ hoặc không bảo đảm tiêu chuẩn kỹ thuật (kể cả rơ moóc và sơ mi rơ moóc);"

13.3.d:
  code_name: d
  full_name: "Điều khiển xe ô tô kinh doanh vận tải hành khách lắp thêm hoặc tháo bớt ghế, giường nằm hoặc có kích thước khoang chở hành lý (hầm xe) không đúng với thông số kỹ thuật được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe."

13.4:
  code_name: 4
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.4.a:
  code_name: a
  full_name: "Điều khiển xe không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) đã hết hạn sử dụng, hết hiệu lực (kể cả rơ moóc và sơ mi rơ moóc);"

13.4.b:
  code_name: b
  full_name: "Điều khiển xe ô tô tải (kể cả rơ moóc và sơ mi rơ moóc) có kích thước thùng xe không đúng với thông số kỹ thuật được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe;"

13.4.c:
  code_name: c
  full_name: "Điều khiển xe dán, lắp phù hiệu, biểu trưng nhận diện tương tự của các cơ quan nhà nước, cơ quan ngoại giao, tổ chức quốc tế tại Việt Nam."

13.5:
  code_name: 5
  full_name: "Phạt tiền từ 3.000.000 đồng đến 4.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.5.a:
  code_name: a
  full_name: "Điều khiển xe có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường nhưng đã hết hiệu lực (hạn sử dụng) dưới 01 tháng (kể cả rơ moóc và sơ mi rơ moóc);"

13.5.b:
  code_name: b
  full_name: "Điều khiển xe không đủ hệ thống hàm hoặc có đủ hệ thống hãm nhưng không có tác dụng, không đúng tiêu chuẩn an toàn kỹ thuật (kể cả rơ moóc và sơ mi rơ moóc);"

13.5.c:
  code_name: c
  full_name: "Điều khiển xe kinh doanh vận tải có niên hạn sử dụng không bảo đảm điều kiện của hình thức kinh doanh đã đăng ký;"

13.5.d:
  code_name: d
  full_name: "Điều khiển xe lắp đặt, sử dụng còi vượt quá âm lượng theo quy định."

13.6:
  code_name: 6
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.6.a:
  code_name: a
  full_name: "Sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường không do cơ quan có thẩm quyền cấp hoặc bị tẩy xóa; sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không đúng số khung, số động cơ (số máy) của xe (kể cả rơ moóc và sơ mi rơ moóc);"

13.6.b:
  code_name: b
  full_name: "Điều khiển xe không có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường (đối với loại xe có quy định phải kiểm định, trừ xe đăng ký tạm thời) hoặc có nhưng đã hết hiệu lực (hạn sử dụng) từ 01 tháng trở lên (kể cả rơ moóc và sơ mi rơ moóc)."

13.7:
  code_name: 7
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.7.a:
  code_name: a
  full_name: "Điều khiển xe đăng ký tạm thời, xe có phạm vi hoạt động hạn chế hoạt động quá phạm vi, tuyến đường, thời hạn cho phép;"

13.7.b:
  code_name: b
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) không gắn biển số (đối với loại xe có quy định phải gắn biển số)."

13.8:
  code_name: 8
  full_name: "Phạt tiền từ 20.000.000 đồng đến 26.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

13.8.a:
  code_name: a
  full_name: "Điều khiển xe gắn biển số không đúng với chứng nhận đăng ký xe hoặc gắn biển số không do cơ quan có thẩm quyền cấp (kể cả rơ moóc và sơ mi rơ moóc);"

13.8.b:
  code_name: b
  full_name: "Điều khiển xe không gắn đủ biển số hoặc gắn biển số không đúng vị trí, không đúng quy cách theo quy định; gắn biển số không rõ chữ, số hoặc sử dụng chất liệu khác sơn, dán lên chữ, số của biển số xe; gắn biển số bị bẻ cong, che lấp, làm thay đổi chữ, số, màu sắc (của chữ, số, nền biển số xe), hình dạng, kích thước của biển số xe (kể cả rơ moóc và sơ mi rơ moóc)."

13.9:
  code_name: 9
  full_name: "Tịch thu phương tiện đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây:"

13.9.a:
  code_name: a
  full_name: "Điều khiển xe quá niên hạn sử dụng tham gia giao thông, trừ hành vi quy định tại điểm c khoản 5 Điều này;"

13.9.b:
  code_name: b
  full_name: "Điều khiển loại xe sản xuất, lắp ráp trái quy định tham gia giao thông (bao gồm cả xe công nông thuộc diện bị đình chỉ tham gia giao thông, rơ moóc và sơ mi rơ moóc được kéo theo)."

"13.10":
  code_name: 10
  full_name: "Ngoài việc bị phạt tiền, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

13.10.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 8 Điều này bị tịch thu biển số xe;"

13.10.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 4, điểm a khoản 6 Điều này trong trường hợp không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngàn hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không: do cơ quan có thẩm quyền cấp, không đúng số khung, số động cơ (số máy) của xe hoặc bị tẩy xóa (kể cả rơ moóc và sơ mi rơ moóc) mà không chứng minh được nguồn gốc xuất xứ của phương tiện (không có giấy tờ, chứng nhận nguồn gốc xe, chứng nhận quyền sở hữu hợp pháp) thì bị tịch thu phương tiện."

13.11:
  code_name: 11
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các biện pháp khắc phục hậu quả sau đây:"

13.11.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 1; khoản 2; điểm b, điểm c khoản 3; điểm b khoản 4; điểm b, điểm d khoản 5; điểm b khoản 8 Điều này buộc lắp đầy đủ thiết bị hoặc thay thế thiết bị đủ tiêu chuẩn, quy chuẩn an toàn kỹ thuật hoặc khôi phục lại tính năng kỹ thuật của thiết bị theo quy định; buộc thực hiện đúng quy định về biển số hoặc khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra;"

13.11.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm d khoản 3 Điều này buộc lắp đầy đủ thiết bị hoặc khôi phục lại tính năng kỹ thuật của thiết bị theo quy định, tháo bỏ những thiết bị lắp thêm không đúng quy định;"

13.11.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm c khoản 4 Điều này buộc khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra;"

13.11.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 6 Điều này buộc nộp lại chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường, chứng nhận đăng ký xe bị tẩy xóa."

13.12:
  code_name: 12
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi quy định tại điểm a khoản 6 Điều này bị thu hồi chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp hoặc không đúng số khung, số động cơ (số máy) của xe, giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường không do cơ quan có thẩm quyền cấp."

13.13:
  code_name: 13
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

13.13.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b khoản 3; khoản 4; khoản 5; khoản 6; điểm a khoản 7 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

13.13.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 7, điểm b khoản 8 Điều này bị trừ điểm giấy phép lái xe 06 điểm;"

13.13.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 8 Điều này bị trừ điểm giấy phép lái xe 10 điểm."

14:
  code_name: 14
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy vi phạm quy định về điều kiện của phương tiện khi tham gia giao thông

14.1:
  code_name: 1
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:"

14.1.a:
  code_name: a
  full_name: "Điều khiển xe không có còi; đèn soi biển số; đèn báo hãm; gương chiếu hậu bên trái người điều khiển hoặc có nhưng không có tác dụng;"

14.1.b:
  code_name: b
  full_name: "Điều khiển xe không có đèn tín hiệu hoặc có nhưng không có tác dụng;"

14.1.c:
  code_name: c
  full_name: "Điều khiển xe không có đèn chiếu sáng gần, xa hoặc có nhưng không có tác dụng, không đúng tiêu chuẩn thiết kế;"

14.1.d:
  code_name: d
  full_name: "Điều khiển xe không có hệ thống hãm hoặc có nhưng không có tác dụng, không bảo đảm tiêu chuẩn kỹ thuật;"

14.1.đ:
  code_name: đ
  full_name: "Điều khiển xe lắp đèn chiếu sáng về phía sau xe."

14.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

14.2.a:
  code_name: a
  full_name: "Điều khiển xe không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) đã hết hạn sử dụng, hết hiệu lực;"

14.2.b:
  code_name: b
  full_name: "Sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) bị tẩy xóa; sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không đúng số khung, số động cơ (số máy) của xe hoặc không do cơ quan có thẩm quyền cấp;"

14.2.c:
  code_name: c
  full_name: "Điều khiển xe đăng ký tạm thời hoạt động quá phạm vi, tuyến đường, thời hạn cho phép;"

14.2.d:
  code_name: d
  full_name: "Điều khiển xe không có bộ phận giảm thanh, giảm khói hoặc có nhưng không bảo đảm quy chuẩn môi trường về khí thải, tiếng ồn;"

14.2.đ:
  code_name: đ
  full_name: "Sử dụng còi không đúng quy chuẩn kỹ thuật cho từng loại xe."

14.3:
  code_name: 3
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

14.3.a:
  code_name: a
  full_name: "Điều khiển xe không gắn biển số (đối với loại xe có quy định phải gắn biển số); gắn biển số không đúng với chứng nhận đăng ký xe hoặc gắn biển số không do cơ quan có thẩm quyền cấp;"

14.3.b:
  code_name: b
  full_name: "Điều khiển xe gắn biển số không đúng vị trí, không đúng quy cách theo quy định; gắn biển số không rõ chữ, số hoặc sử dụng chất liệu khác sơn, dán lên chữ, số của biển số xe; gắn biển số bị bẻ cong, che lấp, làm thay đổi chữ, số, màu sắc (của chữ, số, nền biển số xe), hình dạng, kích thước của biển số xe."

14.4:
  code_name: 4
  full_name: "Tịch thu phương tiện đối với hành vi điều khiển loại xe sản xuất, lắp ráp trái quy định tham gia giao thông."

14.5:
  code_name: 5
  full_name: "Ngoài việc bị phạt tiền, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

14.5.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 3 Điều này bị tịch thu biển số xe;"

14.5.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định lại điểm a, điểm b khoản 2 Điều này trong trường hợp không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp, không đúng số khung, số động cơ (số máy) của xe hoặc bị tẩy xóa mà không chứng minh được nguồn gốc xuất xứ của phương tiện (không có giấy tờ, chứng nhận nguồn gốc xe, chứng nhận quyền sở hữu hợp pháp) thì bị tịch thu phương tiện."

14.6:
  code_name: 6
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị áp dụng các biện pháp khắc phục hậu quả sau đây:"

14.6.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm đ khoản 2 Điều này buộc thay thế thiết bị đủ tiêu chuẩn an toàn kỹ thuật hoặc khôi phục tính năng kỹ thuật của thiết bị theo quy định;"

14.6.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 2 Điều này buộc nộp lại chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) đã bị tẩy xóa."

14.7:
  code_name: 7
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi quy định tại điểm b khoản 2 Điều này bị thu hồi chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không đúng số khung, số động cơ (số máy) của xe hoặc không do cơ quan có thẩm quyền cấp."

14.8:
  code_name: 8
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

14.8.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b, điểm c khoản 2 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

14.8.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 3 Điều này bị trừ điểm giấy phép lái xe 06 điểm."

15:
  code_name: 15
  full_name: Xử phạt người điều khiển xe thô sơ vi phạm quy định về điều kiện của phương tiện khi tham gia giao thông

15.1:
  code_name: 1
  full_name: "Phạt tiền từ 100.000 đồng đến 200.000 đồng đối với hành vi điều khiển xe không có bộ phận phát âm thanh cảnh báo (còi, chuông); không có đèn chiếu sáng hoặc tấm phản quang phía trước; không có đèn tín hiệu hoặc tấm phản quang phía sau xe (đối với loại xe quy định phải có bộ phận này)."

15.2:
  code_name: 2
  full_name: "Phạt tiền từ 300.000 đồng đến 400.000 đồng đối với hành vi điều khiển xe không có hệ thống (bộ phận) hãm hoặc có nhưng không có hiệu lực (đối với loại xe quy định phải có hệ thống (bộ phận) này)."

16:
  code_name: 16
  full_name: Xử phạt người điều khiển xe máy chuyên dùng (kể cả rơ moóc được kéo theo) vi phạm quy định về điều kiện của phương tiện khi tham gia giao thông

16.1:
  code_name: 1
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

16.1.a:
  code_name: a
  full_name: "Điều khiển xe không gắn biển số (đối với loại xe có quy định phải gắn biển số);"

16.1.b:
  code_name: b
  full_name: "Điều khiển xe không có hệ thống hãm hoặc có hệ thống hãm nhưng không bảo đảm tiêu chuẩn kỹ thuật; điều khiển xe có hệ thống chuyển hướng không bảo đảm tiêu chuẩn kỹ thuật;"

16.1.c:
  code_name: c
  full_name: "Điều khiển xe có các bộ phận chuyên dùng lắp đặt không đúng vị trí; không bảo đảm an toàn khi di chuyển;"

16.1.d:
  code_name: d
  full_name: "Điều khiển xe không có đủ đèn chiếu sáng; không có bộ phận giảm thanh, giảm khói hoặc có nhưng không có tác dụng, không bảo đảm quy chuẩn môi trường về khí thải, tiếng ồn;"

16.1.đ:
  code_name: đ
  full_name: "Điều khiển xe có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường nhưng đã hết hiệu lực (hạn sử dụng) dưới 01 tháng (kể cả rơ moóc);"

16.1.e:
  code_name: e
  full_name: "Điều khiển xe không gắn đủ biển số hoặc gắn biển số không đúng vị trí, không đúng quy cách theo quy định; gắn biển số không rõ chữ, số của biển số xe hoặc sử dụng chất liệu khác sơn, dán lên chữ, số của biển số xe; gắn biển số bị bẻ cong, che lấp, làm thay đổi chữ, số, màu sắc (của chữ, số, nền biển số xe), hình dạng, kích thước của biển số xe."

16.2:
  code_name: 2
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

16.2.a:
  code_name: a
  full_name: "Điều khiển xe hoạt động không đúng phạm vi quy định;"

16.2.b:
  code_name: b
  full_name: "Điều khiển xe không có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường (đối với loại xe có quy định phải kiểm định, trừ xe đăng ký tạm thời) hoặc có nhưng đã hết hiệu lực (hạn sử dụng) từ 01 tháng trở lên (kể cả rơ moóc);"

16.2.c:
  code_name: c
  full_name: "Điều khiển xe không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) đã hết hạn sử dụng, hết hiệu lực (kể cả rơ moóc);"

16.2.d:
  code_name: d
  full_name: "Điều khiển xe gắn biển số không đúng với chứng nhận đăng ký xe hoặc gắn biển số không do cơ quan có thẩm quyền cấp (kể cả rơ moóc);"

16.2.đ:
  code_name: đ
  full_name: "Sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngán hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường không do cơ quan có thẩm quyền cấp hoặc bị tẩy xóa; sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không đúng số khung, số động cơ (số máy) của xe (kể cả rơ moóc)."

16.3:
  code_name: 3
  full_name: "Tịch thu phương tiện đối với hành vi điều khiển xe máy chuyên dùng sản xuất, lắp ráp hoặc cải tạo trái quy định tham gia giao thông."

16.4:
  code_name: 4
  full_name: "Ngoài việc bị phạt tiền, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

16.4.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm d khoản 2 Điều này bị tịch thu biển số xe;"

16.4.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm c, điểm đ khoản 2 Điều này trong trường hợp không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc sử dụng chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp, không đúng số khung, số động cơ (số máy) của xe hoặc bị tẩy xóa (kể cả rơ moóc) mà không chứng minh được nguồn gốc xuất xứ của phương tiện (không có giấy tờ, chứng nhận nguồn gốc xe, chứng nhận quyền sở hữu hợp pháp) thì bị tịch thu phương tiện."

16.5:
  code_name: 5
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị áp dụng biện pháp khắc phục hậu quả sau đây:"

16.5.a:
  code_name: a
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm b, điểm c, điểm d khoản 1 Điều này buộc lắp đầy đủ thiết bị hoặc thay thế thiết bị đủ tiêu chuẩn, quy chuẩn an toàn kỹ thuật hoặc khôi phục lại tính năng kỹ thuật của thiết bị theo quy định;"

16.5.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm đ khoản 2 Điều này buộc nộp lại chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường bị tẩy xóa."

16.6:
  code_name: 6
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển xe thực hiện hành vi quy định tại điểm đ khoản 2 Điều này bị thu hồi chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp hoặc không đúng số khung, số động cơ (số máy) của xe, giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường không do cơ quan có thẩm quyền cấp."

17:
  code_name: 17
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô, máy kéo và các loại xe tương tự xe ô tô vi phạm quy định về bảo vệ môi trường khi tham gia giao thông

17.1:
  code_name: 1
  full_name: "Phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với hành vi điều khiển xe không đáp ứng yêu cầu về vệ sinh lưu thông trong đô thị."

17.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 4.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

17.2.a:
  code_name: a
  full_name: "Chở đất đá, phế thải, hàng rời mà không có mui, bạt che đậy hoặc có mui, bạt che đậy nhưng vẫn để rơi vãi; làm rơi vãi hàng hóa trên đường bộ; chở hàng hoặc chất thải để nước chảy xuống mặt đường gây mất an toàn giao thông;"

17.2.b:
  code_name: b
  full_name: "Lôi kéo bùn, đất, cát, nguyên liệu, vật liệu hoặc chất phế thải khác ra đường bộ gây mất an toàn giao thông."

17.3:
  code_name: 3
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với người điều khiển xe đổ trái phép rác, đất, cát, đá, vật liệu, chất phế thải trong phạm vi đất dành cho đường bộ ở đoạn đường ngoài đô thị."

17.4:
  code_name: 4
  full_name: "Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với người điều khiển xe thực hiện hành vi đổ trái phép rác, đất, cát, đá, vật liệu, chất phế thải ra đường phố."

17.5:
  code_name: 5
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện (khi điều khiển xe ô tô) thực hiện hành vi vi phạm quy định tại khoản 3, khoản 4 Điều này còn bị trừ điểm giấy phép lái xe 02 điểm."

II.3:
  code_name: Mục 3
  full_name: "VI PHẠM QUY ĐỊNH VỀ NGƯỜI ĐIỀU KHIỂN PHƯƠNG TIỆN THAM GIA GIAO THÔNG ĐƯỜNG BỘ"

18:
  code_name: 18
  full_name: Xử phạt, trừ điểm giấy phép lái xe các hành vi vi phạm quy định về điều kiện của người điều khiển xe cơ giới

18.1:
  code_name: 1
  full_name: "Phạt cảnh cáo người từ đủ 14 tuổi đến dưới 16 tuổi điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy hoặc điều khiển xe ô tô, điều khiển xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô."

18.2:
  code_name: 2
  full_name: "Phạt tiền từ 200.000 đồng đến 300.000 đồng đối với một trong các hành vi vi phạm sau đây:"

18.2.a:
  code_name: a
  full_name: "Người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy kinh doanh vận tải không mang theo chứng nhận bảo hiểm bắt buộc trách nhiệm dân sự của chủ xe cơ giới còn hiệu lực;"

18.2.b:
  code_name: b
  full_name: "Người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy không có chứng nhận bảo hiểm bắt buộc trách nhiệm dân sự của chủ xe cơ giới còn hiệu lực;"

18.2.c:
  code_name: c
  full_name: "Người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy kinh doanh vận tải không mang theo chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe);"

18.2.d:
  code_name: d
  full_name: "Người điều khiển xe mô tô và các loại xe tương tự xe mô tô kinh doanh vận tải không mang theo giấy phép lái xe trừ hành vi vi phạm quy định tại điểm b khoản 5, điểm c khoản 7 Điều này."

18.3:
  code_name: 3
  full_name: "Phạt tiền từ 300.000 đồng đến 400.000 đồng đối với một trong các hành vi vi phạm sau đây:"

18.3.a:
  code_name: a
  full_name: "Người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô kinh doanh vận tải không mang theo giấy phép lái xe, trừ hành vi vi phạm quy định tại điểm c khoản 8 Điều này;"

18.3.b:
  code_name: b
  full_name: "Người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, rơ moóc, sơ mi rơ moóc và các loại xe tương tự xe ô tô kinh doanh vận tải không mang theo chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe);"

18.3.c:
  code_name: c
  full_name: "Người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, rơ moóc, sơ mi rơ moóc và các loại xe tương tự xe ô tô kinh doanh vận tải không mang theo giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường đối với loại xe có quy định phải kiểm định."

18.4:
  code_name: 4
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:"

18.4.a:
  code_name: a
  full_name: "Người từ đủ 16 tuổi đến dưới 18 tuổi điều khiển xe mô tô có dung tích xi- lanh từ 50 cm3 trở lên hoặc có công suất động cơ điện từ 04 kW trở lên;"

18.4.b:
  code_name: b
  full_name: "Người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô kinh doanh vận tải không mang theo chứng nhận bảo hiểm bắt buộc trách nhiệm dân sự của chủ xe cơ giới còn hiệu lực;"

18.4.c:
  code_name: c
  full_name: "Người điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô không có chứng nhận bảo hiểm bắt buộc trách nhiệm dân sự của chủ xe cơ giới còn hiệu lực."

18.5:
  code_name: 5
  full_name: "Phạt tiền từ 2.000.000 đồng đến 4.000.000 đồng đối với người điều khiển xe mô tô hai bánh có dung tích xi-lanh đến 125 cm3 hoặc có công suất động cơ điện đến 11 kW và các loại xe tương tự xe mô tô thực hiện một trong các hành vi vi phạm sau đây:"

18.5.a:
  code_name: a
  full_name: "Không có giấy phép lái xe hoặc sử dụng giấy phép lái xe đã bị trừ hết điểm hoặc sử dụng giấy phép lái xe không do cơ quan có thẩm quyền cấp, giấy phép lái xe bị tẩy xóa, giấy phép lái xe không còn hiệu lực, giấy phép lái xe không phù hợp với loại xe đang điều khiển;"

18.5.b:
  code_name: b
  full_name: "Có giấy phép lái xe quốc tế do các nước tham gia Công ước của Liên hợp quốc về Giao thông đường bộ năm 1968 cấp (trừ giấy phép lái xe quốc tế do Việt Nam cấp) nhưng không mang theo giấy phép lái xe quốc gia phù hợp với loại xe được phép điều khiển;"

18.5.c:
  code_name: c
  full_name: "Sử dụng giấy phép lái xe không hợp lệ (giấy phép lái xe có số phôi ghi ở mặt sau không trùng với số phôi được cấp mới nhất trong hệ thống thông tin quản lý giấy phép lái xe)."

18.6:
  code_name: 6
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với người từ đủ 16 tuổi đến dưới 18 tuổi điều khiển xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô."

18.7:
  code_name: 7
  full_name: "Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với người điều khiển xe mô tô hai bánh có dung tích xi-lanh trên 125 cm3 trở lên hoặc có công suất động cơ điện trên 11 kW, xe mô tô ba bánh thực hiện một trong các hành vi vi phạm sau đây:"

18.7.a:
  code_name: a
  full_name: "Có giấy phép lái xe nhưng không phù hợp với loại xe đang điều khiển;"

18.7.b:
  code_name: b
  full_name: "Không có giấy phép lái xe hoặc sử dụng giấy phép lái xe đã bị trừ hết điểm, giấy phép lái xe không do cơ quan có thẩm quyền cấp, giấy phép lái xe bị tẩy xóa, giấy phép lái xe không còn hiệu lực;"

18.7.c:
  code_name: c
  full_name: "Có giấy phép lái xe quốc tế do các nước tham gia Công ước của Liên hợp quốc về Giao thông đường bộ năm 1968 cấp (trừ giấy phép lái xe quốc tế do Việt Nam cấp) nhưng không mang theo giấy phép lái xe quốc gia phù hợp với loại xe được phép điều khiển;"

18.7.d:
  code_name: d
  full_name: "Sử dụng giấy phép lái xe không hợp lệ (giấy phép lái xe có số phôi ghi ở mặt sau không trùng với số phôi được cấp mới nhất trong hệ thống thông tin quản lý giấy phép lái xe)."

18.8:
  code_name: 8
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với người điều khiển xe ô tô và các loại xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ vi phạm một trong các hành vi sau đây:"

18.8.a:
  code_name: a
  full_name: "Có giấy phép lái xe nhưng đã hết hạn sử dụng dưới 01 năm;"

18.8.b:
  code_name: b
  full_name: "Có giấy phép lái xe quốc tế do các nước tham gia Công ước của Liên hợp quốc về Giao thông đường bộ năm 1968 cấp (trừ giấy phép lái xe quốc tế do Việt Nam cấp) nhưng không mang theo giấy phép lái xe quốc gia phù hợp với loại xe được phép điều khiển;"

18.8.c:
  code_name: c
  full_name: "Sử dụng giấy phép lái xe không hợp lệ (giấy phép lái xe có số phôi ghi ở mặt sau không trùng với số phôi được cấp mới nhất trong hệ thống thông tin quản lý giấy phép lái xe)."

18.9:
  code_name: 9
  full_name: "Phạt tiền từ 18.000.000 đồng đến 20.000.000 đồng đối với người điều khiển xe ô tô và các loại xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ vi phạm một trong các hành vi sau đây:"

18.9.a:
  code_name: a
  full_name: "Có giấy phép lái xe nhưng không phù hợp với loại xe đang điều khiển hoặc có giấy phép lái xe nhưng đã hết hạn sử dụng từ 01 năm trở lên;"

18.9.b:
  code_name: b
  full_name: "Không có giấy phép lái xe hoặc sử dụng giấy phép lái xe đã bị trừ hết điểm hoặc sử dụng giấy phép lái xe không do cơ quan có thẩm quyền cấp, giấy phép lái xe bị tẩy xóa, giấy phép lái xe không còn hiệu lực."

"18.10":
  code_name: 10
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 5, điểm b khoản 7, điểm b khoản 9 Điều này còn bị áp dụng biện pháp khắc phục hậu quả buộc nộp lại giấy phép lái xe bị tẩy xóa."

18.11:
  code_name: 11
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm c khoản 5; điểm b, điểm d khoản 7; điểm c khoản 8; điểm b khoản 9 Điều này bị thu hồi giấy phép lái xe không do cơ quan có thẩm quyền cấp, giấy phép lái xe không hợp lệ."

18.12:
  code_name: 12
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi quy định tại điểm c khoản 5, điểm d khoản 7, điểm c khoản 8 Điều này bị trừ điểm giấy phép lái xe được cấp mới nhất trong hệ thống thông tin quản lý giấy phép lái xe 02 điểm."

19:
  code_name: 19
  full_name: Xử phạt các hành vi vi phạm quy định về điều kiện của người điều khiển xe máy chuyên dùng

19.1:
  code_name: 1
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với người điều khiển xe máy chuyên dùng không có chứng nhận bảo hiểm bắt buộc trách nhiệm dân sự theo quy định của pháp luật."

19.2:
  code_name: 2
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với người điều khiển xe máy chuyên dùng không có bằng (hoặc chứng chỉ) điều khiển xe máy chuyên dùng, không có giấy phép lái xe (hoặc sử dụng giấy phép lái xe đã bị trừ hết điểm, giấy phép lái xe không do cơ quan có thẩm quyền cấp, giấy phép lái xe bị tẩy xóa, giấy phép lái xe không còn hiệu lực) hoặc không có chứng chỉ bồi dưỡng kiến thức pháp luật về giao thông đường bộ."

II.4:
  code_name: c
  full_name: "VI PHẠM QUY ĐỊNH VỀ BẢO ĐẢM TRẬT TỰ, AN TOÀN GIAO THÔNG ĐƯỜNG BỘ ĐỐI VỚI XE Ô TÔ VẬN CHUYỂN HÀNH KHÁCH, HÀNG HÓA, HÀNG SIÊU TRƯỜNG, SIÊU TRỌNG, HÀNG HÓA NGUY HIỂM, CHỞ TRẺ EM MẦM NON, HỌC SINH; XE CHỞ NGƯỜI BỐN BÁNH CÓ GẮN ĐỘNG CƠ, XE CHỞ HÀNG BỐN BÁNH CÓ GẮN ĐỘNG CƠ; XE CỨU HỘ GIAO THÔNG ĐƯỜNG BỘ; XE VẬN CHUYỂN ĐỘNG VẬT SỐNG, THỰC PHẨM TƯƠI SỐNG; XE CỨU THƯƠNG"

20:
  code_name: 20
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô chở hành khách, ô tô chở người và các loại xe tương tự xe ô tô chở hành khách vi phạm quy định về bảo đảm trật trị, an toàn giao thông

20.1:
  code_name: 1
  full_name: "Phạt tiền từ 100.000 đồng đến 200.000 đồng đối với hành vi vi phạm: không hướng dẫn hành khách đứng, nằm, ngồi đúng vị trí quy định trong xe."

20.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 75.000.000 đồng đối với người điều khiển xe ô tô chở hành khách, ô tô chở người (trừ xe buýt) thực hiện hành vi vi phạm chở quá số người quy định được phép chở của phương tiện, trừ các hành vi vi phạm quy định tại khoản 4 Điều này."

20.3:
  code_name: 3
  full_name: "Phạt tiền từ 600.000 đồng đến 800.000 đồng đối với một trong các hành vi vi phạm sau đây:"

20.3.a:
  code_name: a
  full_name: "Không đóng cửa lên xuống khi xe đang chạy;"

20.3.b:
  code_name: b
  full_name: "Để người ngồi trên xe khi xe xuống phà, đang trên phà và khi lên bến (trừ người lái xe, trẻ em, phụ nữ mang thai, người già yếu, người bệnh, người khuyết tật);"

20.3.c:
  code_name: c
  full_name: "Không chạy đúng tuyến đường, lịch trình, hành trình vận tải được phép hoạt động theo quy định;"

20.3.d:
  code_name: d
  full_name: "Để người mắc võng nằm trên xe khi xe đang chạy;"

20.3.đ:
  code_name: đ
  full_name: "Sắp xếp, chằng buộc hành lý, hàng hóa không bảo đảm an toàn; để rơi hành lý, hàng hóa trên xe xuống đường; để hàng hóa trong khoang chở hành khách;"

20.3.e:
  code_name: e
  full_name: "Chở hành lý, hàng hóa vượt quá kích thước bao ngoài của xe;"

20.3.g:
  code_name: g
  full_name: "Điều khiển xe vận tải hành khách không có nhân viên phục vụ trên xe đối với những xe quy định phải có nhân viên phục vụ;"

20.3.h:
  code_name: h
  full_name: "Điều khiển xe ô tô kinh doanh vận tải không có dây đai an toàn tại các vị trí ghế ngồi, giường nằm theo quy định (trừ xe buýt nội tỉnh);"

20.3.i:
  code_name: i
  full_name: "Điều khiển xe ô tô kinh doanh vận tải không có hướng dẫn cho hành khách về an toàn giao thông và thoát hiểm khi xảy ra sự cố trên xe theo quy định;"

20.3.k:
  code_name: k
  full_name: "Điều khiển xe không niêm yết hành trình chạy xe hoặc niêm yết hành trình chạy xe không đúng với hành trình đã được cơ quan có thẩm quyền cấp phép."

20.4:
  code_name: 4
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 75.000.000 đồng đối với người điều khiển xe ô tô chở hành khách (kinh doanh vận tải hành khách theo tuyến cố định, hợp đồng) chạy tuyến có cự ly lớn hơn 300 km thực hiện hành vi vi phạm chở quá số người quy định được phép chở của phương tiện."

20.5:
  code_name: 5
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

20.5.a:
  code_name: a
  full_name: "Để người lên, xuống xe khi xe đang chạy;"

20.5.b:
  code_name: b
  full_name: "Xếp hành lý, hàng hóa trên xe làm lệch xe;"

20.5.c:
  code_name: c
  full_name: "Đón, trả hành khách không đúng nơi quy định trên những tuyến đường đã xác định nơi đón, trả khách hoặc dừng đón, trả hành khách quá thời gian quy định, trừ hành vi vi phạm quy định tại khoản 8 Điều này;"

20.5.d:
  code_name: d
  full_name: "Đón, trả hành khách tại nơi cấm dừng, cấm đỗ, nơi đường cong tầm nhìn bị che khuất, trừ hành vi vi phạm quy định tại khoản 8 Điều này;"

20.5.đ:
  code_name: đ
  full_name: "Điều khiển xe vận tải hành khách theo hợp đồng sử dụng hợp đồng bằng văn bản giấy không có hoặc không mang theo danh sách hành khách theo quy định, chở người không có tên trong danh sách hành khách hoặc vận chuyển không đúng đối tượng theo quy định (đối với xe kinh doanh vận tải hành khách theo hợp đồng vận chuyển trẻ em mầm non, học sinh, sinh viên, cán bộ, công chức, viên chức, công nhân), không có hoặc không mang theo hợp đồng vận tải hoặc có hợp đồng vận tải nhưng không đúng theo quy định;"

20.5.e:
  code_name: e
  full_name: "Vận chuyển hành khách theo tuyến cố định không có hoặc không mang theo lệnh vận chuyển hoặc có mang theo lệnh vận chuyển nhưng không ghi đầy đủ thông tin, không có xác nhận của bến xe khách nơi đi, bến xe khách nơi đến theo quy định;"

20.5.g:
  code_name: g
  full_name: "Đón, trả hành khách không đúng địa điểm đón, trả hành khách được ghi trong hợp đồng, trừ hành vi vi phạm quy định tại khoản 8 Điều này;"

20.5.h:
  code_name: h
  full_name: "Vận chuyển khách liên vận quốc tế theo tuyến cố định không có hoặc không mang theo lệnh vận chuyển, không có danh sách hành khách theo quy định hoặc chở người không có tên trong danh sách hành khách, trừ hành vi vi phạm quy định tại điểm b khoản 1 Điều 37 của Nghị định này;"

20.5.i:
  code_name: i
  full_name: "Chở hành lý, hàng hóa vượt quá trọng tải theo thiết kế của xe;"

20.5.k:
  code_name: k
  full_name: "Không sử dụng thẻ nhận dạng lái xe để đăng nhập thông tin theo quy định hoặc sử dụng thẻ nhận dạng lái xe của lái xe khác để đăng nhập thông tin khi điều khiển xe ô tô chở khách;"

20.5.l:
  code_name: l
  full_name: "Điều khiển xe ô tô chở người từ 08 chỗ trở lên (không kể chỗ của người lái xe) kinh doanh vận tải hành khách không lắp thiết bị ghi nhận hình ảnh người lái xe hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô;"

20.5.m:
  code_name: m
  full_name: "Điều khiển xe vận tải hành khách theo hợp đồng sử dụng hợp đồng điện tử không có thiết bị để truy cập được nội dung của hợp đồng điện tử và danh sách hành khách hoặc có nhưng không cung cấp cho lực lượng chức năng khi có yêu cầu, chở người không có tên trong danh sách hành khách hoặc vận chuyển không đúng đối tượng theo quy định (đối với xe kinh doanh vận tải hành khách theo hợp đồng vận chuyển trẻ em mầm non, học sinh, sinh viên, cán bộ, công chức, viên chức, công nhân)."

20.6:
  code_name: 6
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

20.6.a:
  code_name: a
  full_name: "Vận chuyển hàng hóa nguy hiểm, hàng độc hại, dễ cháy, dễ nổ, động vật, hàng có mùi hôi thối hoặc hàng hóa khác ảnh hưởng đến sức khỏe của hành khách trên xe;"

20.6.b:
  code_name: b
  full_name: "Chở người trên mui xe, trong khoang chở hành lý của xe;"

20.6.c:
  code_name: c
  full_name: "Đe dọa, xúc phạm, tranh giành, lôi kéo hành khách; đe dọa, cưỡng ép hành khách sử dụng dịch vụ ngoài ý muốn; chuyển tải, xuống khách hoặc các hành vi khác nhằm trốn tránh phát hiện xe chở quá tải, quá số người theo quy định của pháp luật;"

20.6.d:
  code_name: d
  full_name: "Điều khiển xe ô tô kinh doanh vận tải quá thời gian quy định tại khoản 1 Điều 64 của Luật Trật tự, an toàn giao thông đường bộ; không thực hiện đúng quy định về thời gian nghỉ giữa hai lần lái xe liên tục của người lái xe;"

20.6.đ:
  code_name: đ
  full_name: "Điều khiển xe kinh doanh vận tải hành khách không lắp thiết bị giám sát hành trình của xe theo quy định hoặc có lắp thiết bị giám sát hành trình của xe nhưng thiết bị không hoạt động theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình của xe ô tô;"

20.6.e:
  code_name: e
  full_name: "Điều khiển xe chở hành khách liên vận quốc tế không có hoặc không gắn ký hiệu phân biệt quốc gia."

20.7:
  code_name: 7
  full_name: "Phạt tiền từ 5.000.000 đồng đến 7.000.000 đồng đối với hành vi vi phạm điều khiển xe chở hành khách không có hoặc không gắn phù hiệu theo quy định hoặc có nhưng đã hết giá trị sử dụng hoặc sử dụng phù hiệu không do cơ quan có thẩm quyền cấp."

20.8:
  code_name: 8
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với người điều khiển xe thực hiện hành vi đón, trả hành khách trên đường cao tốc."

20.9:
  code_name: 9
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 7 Điều này bị thu hồi phù hiệu đã hết giá trị sử dụng hoặc phù hiệu không do cơ quan có thẩm quyền cấp."

"20.10":
  code_name: 10
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

20.10.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm c, điểm d, điểm e khoản 3; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm i, điểm k, điểm m khoản 5; khoản 6; khoản 7 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

20.10.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 2, khoản 4 (trường hợp vượt trên 50% đến 100% số người quy định được phép chở của phương tiện) Điều này bị trừ điểm giấy phép lái xe 04 điểm;"

20.10.c:
  code_name: c
  full_name: "Thực hiện hành vi vi phạm quy định tại khoản 8 Điều này bị trừ điểm giấy phép lái xe 06 điểm;"

20.10.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại khoản 2, khoản 4 (trường hợp vượt trên 100% số người quy định được phép chở của phương tiện) Điều này bị trừ điểm giấy phép lái xe 10 điểm."

21:
  code_name: 21
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô tải, máy kéo (bao gồm cả rơ moóc hoặc sơ mi rơ moóc được kéo theo) và các loại xe tương tự xe ô tô vận chuyển hàng hóa vi phạm quy định về bảo đảm trật tự, an toàn giao thông đường bộ với xe ô tô vận chuyển hàng hóa

21.1:
  code_name: 1
  full_name: "Phạt tiền từ 600.000 đồng đến 800.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.1.a:
  code_name: a
  full_name: "Điều khiển xe xếp hàng trên nóc buồng lái, xếp hàng làm lệch xe;"

21.1.b:
  code_name: b
  full_name: "Không chốt, đóng cố định cửa sau, cửa bên thùng xe khi xe đang chạy."

21.2:
  code_name: 2
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.2.a:
  code_name: a
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) chở hàng vượt trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 10% đến 30% (trừ xe xi téc chở chất lỏng), trên 20% đến 30% đối với xe xi téc chở chất lỏng;"

21.2.b:
  code_name: b
  full_name: "Chở hàng trên nóc thùng xe; chở hàng vượt quá bề rộng thùng xe (kể cả bề rộng rơ moóc và sơ mi rơ moóc); chở hàng vượt phía trước, phía sau thùng xe (kể cả rơ moóc và sơ mi rơ moóc) trên 1,1 lần chiều dài toàn bộ của xe theo thiết kế được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe;"

21.2.c:
  code_name: c
  full_name: "Chở người trên mui xe;"

21.2.d:
  code_name: d
  full_name: "Điều khiển xe kéo theo rơ moóc, sơ mi rơ moóc mà khối lượng toàn bộ (bao gồm khối lượng bản thân rơ moóc, sơ mi rơ moóc và khối lượng hàng chuyên chở) của rơ moóc, sơ mi rơ moóc vượt khối lượng cho phép kéo theo được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 10% đến 30%;"

21.2.đ:
  code_name: đ
  full_name: "Điều khiển xe kinh doanh vận tải hàng hóa không có hoặc không mang theo giấy vận tải bằng văn bản giấy theo quy định hoặc không có thiết bị để truy cập vào được phần mềm thể hiện nội dung của giấy vận tải theo quy định hoặc có thiết bị để truy cập nhưng không cung cấp cho lực lượng chức năng khi có yêu cầu."

21.3:
  code_name: 3
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.3.a:
  code_name: a
  full_name: "Không sử dụng thẻ nhận dạng lái xe để đăng nhập thông tin theo quy định hoặc sử dụng thẻ nhận dạng lái xe của lái xe khác để đăng nhập thông tin khi điều khiển xe tham gia kinh doanh vận tải hàng hóa;"

21.3.b:
  code_name: b
  full_name: "Điều khiển xe ô tô đầu kéo không lắp thiết bị ghi nhận hình ảnh người lái xe hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô."

21.4:
  code_name: 4
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với người điều khiển xe thực hiện hành vi chở hàng vượt quá chiều cao xếp hàng cho phép đối với xe ô tô tải (kể cả rơ moóc và sơ mi rơ moóc)."

21.5:
  code_name: 5
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.5.a:
  code_name: a
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) chở hàng vượt trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 30% đến 50%;"

21.5.b:
  code_name: b
  full_name: "Điều khiển xe ô tô kinh doanh vận tải quá thời gian quy định tại khoản 1 Điều 64 của Luật Trật tự, an toàn giao thông đường bộ; không thực hiện đúng quy định về thời gian nghỉ giữa hai lần lái xe liên tục của người lái xe;"

21.5.c:
  code_name: c
  full_name: "Điều khiển xe ô tô tham gia kinh doanh vận tải hàng hóa không lắp thiết bị giám sát hành trình hoặc có lắp thiết bị giám sát hành trình nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình lắp trên xe ô tô;"

21.5.d:
  code_name: d
  full_name: "Điều khiển xe kéo theo rơ moóc, sơ mi rơ moóc mà khối lượng toàn bộ (bao gồm khối lượng bản thân rơ moóc, sơ mi rơ moóc và khối lượng hàng chuyên chở) của rơ moóc, sơ mi rơ moóc vượt khối lượng cho phép kéo theo được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 30% đến 50%."

21.6:
  code_name: 6
  full_name: "Phạt tiền từ 5.000.000 đồng đến 7.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.6.a:
  code_name: a
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) chở hàng vượt trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 50% đến 100%;"

21.6.b:
  code_name: b
  full_name: "Điều khiển xe kéo theo rơ moóc, sơ mi rơ moóc mà khối lượng toàn bộ (bao gồm khối lượng bản thân rơ moóc, sơ mi rơ moóc và khối lượng hàng chuyên chở) của rơ moóc, sơ mi rơ moóc vượt khối lượng cho phép kéo theo được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 50% đến 100%;"

21.6.c:
  code_name: c
  full_name: "Điều khiển xe không có hoặc không gắn phù hiệu theo quy định (đối với loại xe có quy định phải gắn phù hiệu) hoặc có phù hiệu nhưng đã hết giá trị sử dụng hoặc sử dụng phù hiệu không do cơ quan có thẩm quyền cấp;"

21.6.d:
  code_name: d
  full_name: "Điều khiển xe chở hàng trong đô thị không chạy đúng tuyến, phạm vi, thời gian quy định;"

21.6.đ:
  code_name: đ
  full_name: "Vận chuyển hàng hóa, cung ứng dịch vụ không có giấy phép (đối với trường hợp phải có giấy phép) hoặc có nhưng không thực hiện đúng quy định ghi trong giấy phép, trừ các hành vi vi phạm quy định tại điểm b khoản 1, điểm a, điểm c, điểm d khoản 3 Điều 22; khoản 5 Điều 23; khoản 1, điểm b khoản 3 Điều 34 của Nghị định này."

21.7:
  code_name: 7
  full_name: "Phạt tiền từ 7.000.000 đồng đến 8.000.000 đồng đối với một trong các hành vi sau đây:"

21.7.a:
  code_name: a
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) chở hàng vượt trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 100% đến 150%;"

21.7.b:
  code_name: b
  full_name: "Điều khiển xe kéo theo rơ moóc, sơ mi rơ moóc mà khối lượng toàn bộ (bao gồm khối lượng bản thân rơ moóc, sơ mi rơ moóc và khối lượng hàng chuyên chở) của rơ moóc, sơ mi rơ moóc vượt khối lượng cho phép kéo theo được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 100% đến 150%."

21.8:
  code_name: 8
  full_name: "Phạt tiền từ 8.000.000 đồng đến 12.000.000 đồng đối với một trong các hành vi sau đây:"

21.8.a:
  code_name: a
  full_name: "Điều khiển xe (kể cả rơ moóc và sơ mi rơ moóc) chở hàng vượt trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 150%;"

21.8.b:
  code_name: b
  full_name: "Điều khiển xe kéo theo rơ moóc, sơ mi rơ moóc mà khối lượng toàn bộ (bao gồm khối lượng bản thân rơ moóc, sơ mi rơ moóc và khối lượng hàng chuyên chở) của rơ moóc, sơ mi rơ moóc vượt khối lượng cho phép kéo theo được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 150%;"

21.8.c:
  code_name: c
  full_name: "Chở công-ten-nơ trên xe (kể cả sơ mi rơ moóc) không bảo đảm quy chuẩn, tiêu chuẩn kỹ thuật của công-ten-nơ theo quy định;"

21.8.d:
  code_name: d
  full_name: "Chở công-ten-nơ trên xe (kể cả sơ mi rơ moóc) mà bị cắt nóc trái quy định;"

21.8.đ:
  code_name: đ
  full_name: "Vận chuyển hàng trên xe phải chằng buộc mà không chằng buộc hoặc có chằng buộc nhưng không bảo đảm an toàn theo quy định, trừ hành vi vi phạm quy định tại khoản 10 Điều này."

21.9:
  code_name: 9
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với người điều khiển xe thực hiện hành vi nhận, trả hàng trên đường cao tốc."

"21.10":
  code_name: 10
  full_name: "Phạt tiền từ 18.000.000 đồng đến 22.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

21.10.a:
  code_name: a
  full_name: "Vận chuyển hàng hóa là phương tiện vận tải, máy móc, thiết bị kỹ thuật, hàng dạng trụ không chằng buộc hoặc chằng buộc không theo quy định (trừ việc vận chuyển máy móc khổ lớn (quá khổ) trên phương tiện chuyên dùng và phải có giấy phép lưu hành trên đường bộ);"

21.10.b:
  code_name: b
  full_name: "Chở công-ten-nơ trên xe (kể cả sơ mi rơ moóc) mà không sử dụng cơ cấu khoá hãm công-ten-nơ với xe hoặc có sử dụng cơ cấu khoá hãm nhưng công-ten- nơ vẫn bị xê dịch trong quá trình vận chuyển."

21.11:
  code_name: 11
  full_name: "Phạt tiền từ 30.000.000 đồng đến 35.000.000 đồng đối với hành vi vi phạm quy định tại khoản 1, điểm đ khoản 8, khoản 10 Điều này mà gây tai nạn giao thông."

21.12:
  code_name: 12
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm c khoản 6 Điều này bị thu hồi phù hiệu đã hết giá trị sử dụng hoặc phù hiệu không do cơ quan có thẩm quyền cấp."

21.13:
  code_name: 13
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

21.13.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm b, điểm c, điểm đ khoản 2; điểm a khoản 3; khoản 4; khoản 5; điểm c, điểm d, điểm đ khoản 6 Điều này bị trừ điểm giấy phép lái xe (khi điều khiển xe ô tô) 02 điểm;"

21.13.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b khoản 6; điểm c, điểm d, điểm đ khoản 8; khoản 10 Điều này bị trừ điểm giấy phép lái xe 04 điểm;"

21.13.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại khoản 9 Điều này bị trừ điểm giấy phép lái xe 06 điểm;"

21.13.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại khoản 7 Điều này bị trừ điểm giấy phép lái xe 08 điểm;"

21.13.đ:
  code_name: đ
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b khoản 8; khoản 11 Điều này bị trừ điểm giấy phép lái xe 10 điểm."

22:
  code_name: 22
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô thực hiện hành vi vi phạm quy định về vận chuyển hàng siêu trường, siêu trọng

22.1:
  code_name: 1
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

22.1.a:
  code_name: a
  full_name: "Chở hàng siêu trường, siêu trọng không có báo hiệu kích thước của hàng theo quy định;"

22.1.b:
  code_name: b
  full_name: "Không thực hiện đúng quy định trong giấy phép lưu hành, trừ các hành vi vi phạm quy định tại khoản 2; điểm b, điểm c, điểm d khoản 3 Điều này."

22.2:
  code_name: 2
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với hành vi chở hàng siêu trường, siêu trọng có giấy phép lưu hành còn giá trị sử dụng nhưng kích thước bao ngoài của xe (sau khi đã xếp hàng lên xe) vượt quá quy định trong giấy phép lưu hành."

22.3:
  code_name: 3
  full_name: "Phạt tiền từ 13.000.000 đồng đến 15.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

22.3.a:
  code_name: a
  full_name: "Chở hàng siêu trường, siêu trọng không có giấy phép lưu hành hoặc có giấy phép lưu hành nhưng đã hết giá trị sử dụng hoặc sử dụng giấy phép lưu hành không do cơ quan có thẩm quyền cấp;"

22.3.b:
  code_name: b
  full_name: "Chở hàng siêu trường, siêu trọng có giấy phép lưu hành còn giá trị sử dụng nhưng tổng trọng lượng (sau khi đã xếp hàng lên xe) vượt quá quy định trong giấy phép lưu hành;"

22.3.c:
  code_name: c
  full_name: "Chở hàng siêu trường, siêu trọng có giấy phép lưu hành còn giá trị sử dụng nhưng đi không đúng tuyến đường quy định trong giấy phép lưu hành;"

22.3.d:
  code_name: d
  full_name: "Chở hàng siêu trường, siêu trọng có giấy phép lưu hành còn giá trị sử dụng nhưng chở không đúng loại hàng quy định trong giấy phép lưu hành."

22.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người thực hiện hành vi vi phạm quy định tại khoản 1, khoản 2, khoản 3 Điều này nếu gây hư hại cầu, đường còn bị áp dụng biện pháp khắc phục hậu quả buộc khôi phục lại tình trạng ban đầu đã bị thay đổi do hành vi vi phạm hành chính gây ra."

22.5:
  code_name: 5
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người thực hiện hành vi vi phạm quy định tại điểm a khoản 3 Điều này bị thu hồi giấy phép lưu hành hết giá trị sử dụng hoặc giấy phép lưu hành không do cơ quan có thẩm quyền cấp."

22.6:
  code_name: 6
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

22.6.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 1 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

22.6.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 2, khoản 3 Điều này bị trừ điểm giấy phép lái xe 04 điểm."

23:
  code_name: 23
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô thực hiện hành vi vi phạm quy định về vận chuyển hàng hóa nguy hiểm

23.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi vận chuyển hàng hóa nguy hiểm mà không làm sạch hoặc không bóc (xóa) biểu trưng nguy hiểm trên phương tiện khi không tiếp tục vận chuyển loại hàng hóa đó."

23.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi vận chuyển hàng hóa nguy hiểm mà không mang theo hồ sơ vận chuyển hàng hóa nguy hiểm do người thuê vận tải cung cấp theo quy định, giấy chứng nhận hoàn thành chương trình tập huấn an toàn hàng hóa nguy hiểm phù hợp với loại, nhóm hàng hóa nguy hiểm đang vận chuyển (nếu có)."

23.3:
  code_name: 3
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với hành vi vận chuyển hàng nguy hiểm mà xe ô tô không dán nhãn, biểu trưng nhận diện hàng hóa nguy hiểm; xe ô tô không lắp đèn hoặc tín hiệu cảnh báo theo quy định."

23.4:
  code_name: 4
  full_name: "Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với hành vi vận chuyển hàng hóa nguy hiểm là thuốc nổ, khí đốt, xăng, dầu và các chất dễ cháy, nổ, chất rắn khử nhạy khác đi qua các công trình hầm có chiều dài từ 100 mét trở lên."

23.5:
  code_name: 5
  full_name: "Phạt tiền từ 12.000.000 đồng đến 14.000.000 đồng đối với hành vi vận chuyển hàng hóa nguy hiểm không có giấy phép vận chuyển hàng hóa nguy hiểm hoặc có nhưng hết hiệu lực hoặc không thực hiện đúng quy định trong giấy phép vận chuyển hàng hóa nguy hiểm, trừ các hành vi vi phạm quy định tại điểm a khoản 6 Điều 20 của Nghị định này."

23.6:
  code_name: 6
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người thực hiện hành vi vi phạm quy định tại khoản 4, khoản 5 Điều này nếu gây ô nhiễm môi trường còn bị áp dụng các biện pháp khắc phục hậu quả buộc thực hiện các biện pháp khắc phục tình trạng ô nhiễm môi trường do vi phạm hành chính gây ra."

23.7:
  code_name: 7
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

23.7.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 3, khoản 4 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

23.7.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 5 Điều này bị trừ điểm giấy phép lái xe 04 điểm."

24:
  code_name: 24
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô thực hiện hành vi vi phạm quy định về vận chuyển động vật sống, thực phẩm tươi sống

24.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi vi phạm vận chuyển động vật sống, thực phẩm tươi sống không mang đủ giấy tờ theo quy định (đối với loại động vật sống, thực phẩm tươi sống khi vận chuyển phải có giấy tờ)."

24.2:
  code_name: 2
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với hành vi vi phạm vận chuyển thực phẩm tươi sống không chấp hành quy định về an toàn thực phẩm, vệ sinh dịch tễ, phòng dịch và bảo đảm vệ sinh môi trường theo quy định."

24.3:
  code_name: 3
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều này còn bị trừ điểm giấy phép lái xe 02 điểm."

25:
  code_name: 25
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe vệ sinh môi trường, xe ô tô chở phế thải thực hiện hành vi vi phạm quy định về hoạt động vận tải trong đô thị

25.1:
  code_name: 1
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi điều khiển xe không chạy đúng tuyến, phạm vi, thời gian quy định."

25.2:
  code_name: 2
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 1 Điều này còn bị trừ điểm giấy phép lái xe 02 điểm."

26:
  code_name: 26
  full_name: Xử phạt các hành vi vi phạm quy định về trật tự, an toàn giao thông đường bộ trong vận tải đường bộ, dịch vụ hỗ trợ vận tải đường bộ

26.1:
  code_name: 1
  full_name: "Phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với cá nhân, từ 1.000.000 đồng đến 2.000.000 đồng đối với tổ chức thực hiện một trong các hành vi vi phạm sau đây:"

26.1.a:
  code_name: a
  full_name: "Xếp hàng hóa lên mỗi xe ô tô (kể cả rơ moóc và sơ mi rơ moóc) vượt quá trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 10% đến 50% (trừ xe xi téc chở chất lỏng), trên 20% đến 50% đối với xe xi téc chở chất lỏng;"

26.1.b:
  code_name: b
  full_name: "Xếp hàng hóa lên xe ô tô mà không ký xác nhận việc xếp hàng hóa vào giấy vận tải theo quy định."

26.2:
  code_name: 2
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với cá nhân, từ 2.000.000 đồng đến 4.000.000 đồng đối với tổ chức kinh doanh vận tải, dịch vụ hỗ trợ vận tải thực hiện một trong các hành vi vi phạm sau đây:"

26.2.a:
  code_name: a
  full_name: "Không đánh số thứ tự ghế ngồi, giường nằm trên xe ô tô chở hành khách theo quy định;"

26.2.b:
  code_name: b
  full_name: "Sử dụng xe ô tô kinh doanh vận tải hành khách theo tuyến cố định, xe ô tô kinh doanh vận tải hành khách bằng xe buýt không có chỗ ưu tiên cho người khuyết tật, người cao tuổi và phụ nữ mang thai theo quy định;"

26.2.c:
  code_name: c
  full_name: "Sử dụng xe ô tô kinh doanh vận tải hành khách không có hướng dẫn cho hành khách về an toàn giao thông, thoát hiểm khi xảy ra sự cố trên xe theo quy định;"

26.2.d:
  code_name: d
  full_name: "Không bố trí người áp tải trên xe vận chuyển hàng hóa nguy hiểm đối với những trường hợp quy định phải có người áp tải;"

26.2.đ:
  code_name: đ
  full_name: "Không cấp lệnh vận chuyển, giấy vận tải cho lái xe hoặc cấp lệnh vận chuyển, giấy vận tải nhưng không đúng theo quy định (đối với loại xe quy định phải cấp lệnh vận chuyển, giấy vận tải);"

26.2.e:
  code_name: e
  full_name: "Sử dụng xe vận chuyển hàng hóa nguy hiểm mà không làm sạch hoặc không bóc (xóa) biểu trưng nguy hiểm trên phương tiện khi không tiếp tục vận chuyển loại hàng hóa đó."

26.3:
  code_name: 3
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với cá nhân, từ 4.000.000 đồng đến 6.000.000 đồng đối với tổ chức thực hiện hành vi vi phạm xếp hàng hóa lên mỗi xe ô tô (kể cả rơ moóc và sơ mi rơ moóc) vượt quá trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 50% đến 100%."

26.4:
  code_name: 4
  full_name: "Phạt tiền từ 3.000.000 đồng đến 4.000.000 đồng đối với cá nhân, từ 6.000.000 đồng đến 8.000.000 đồng đối với tổ chức kinh doanh vận tải, dịch vụ hỗ trợ vận tải thực hiện một trong các hành vi vi phạm sau đây:"

26.4.a:
  code_name: a
  full_name: "Không cấp thẻ nhận dạng lái xe cho lái xe theo quy định;"

26.4.b:
  code_name: b
  full_name: "Sử dụng lái xe, nhân viên phục vụ trên xe để tham gia kinh doanh vận tải bằng xe ô tô mà không được tập huấn, hướng dẫn về nghiệp vụ vận tải hành khách và an toàn giao thông theo quy định (đối với hình thức kinh doanh vận tải có quy định lái xe, nhân viên phục vụ trên xe phải được tập huấn, hướng dẫn nghiệp vụ), trừ các hành vi vi phạm quy định tại điểm c, điểm d khoản này;"

26.4.c:
  code_name: c
  full_name: "Sử dụng lái xe, người quản lý trên xe để tham gia kinh doanh vận tải bằng xe ô tô mà không được hướng dẫn về quy trình bảo đảm an toàn khi đưa đón trẻ em mầm non, học sinh;"

26.4.d:
  code_name: d
  full_name: "Sử dụng lái xe, người áp tải vận chuyển hàng hóa nguy hiểm mà không được tập huấn về vận chuyển hàng hóa nguy hiểm;"

26.4.đ:
  code_name: đ
  full_name: "Sử dụng xe ô tô kinh doanh vận tải hành khách không có dây đai an toàn tại các vị trí ghế ngồi, giường nằm theo quy định (trừ xe buýt nội tỉnh);"

26.4.e:
  code_name: e
  full_name: "Sử dụng xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh tiểu học, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh tiểu học không có dây đai an toàn phù hợp với lứa tuổi hoặc không có ghế ngồi phù hợp với lứa tuổi theo quy định;"

26.4.g:
  code_name: g
  full_name: "Không thực hiện việc niêm yết thông tin trên xe theo quy định hoặc có niêm yết nhưng không chính xác, không đầy đủ thông tin theo quy định."

26.5:
  code_name: 5
  full_name: "Phạt tiền từ 4.000.000 đồng đến 5.000.000 đồng đối với cá nhân, từ 8.000.000 đồng đến 10.000.000 đồng đối với tổ chức xếp hàng hóa lên mỗi xe ô tô (kể cả rơ moóc và sơ mi rơ moóc) vượt quá trọng tải (khối lượng hàng chuyên chở) cho phép tham gia giao thông được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe trên 100%."

26.6:
  code_name: 6
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 8.000.000 đồng đến 12.000.000 đồng đối với tổ chức kinh doanh vận tải thực hiện một trong các hành vi vi phạm sau đây:"

26.6.a:
  code_name: a
  full_name: "Sử dụng xe vận chuyển động vật sống không có kết cấu phù hợp với loại động vật chuyên chở theo quy định;"

26.6.b:
  code_name: b
  full_name: "Sử dụng xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh không có thiết bị ghi nhận hình ảnh trẻ em mầm non, học sinh hoặc không có thiết bị có chức năng cảnh báo, chống bỏ quên trẻ em trên xe hoặc không có thiết bị ghi nhận hình ảnh trẻ em mầm non, học sinh và thiết bị có chức năng cảnh báo, chống bỏ quên trẻ em trên xe;"

26.6.c:
  code_name: c
  full_name: "Sử dụng xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh không có màu sơn theo quy định;"

26.6.d:
  code_name: d
  full_name: "Sử dụng xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh không có biển báo dấu hiệu nhận biết là xe chở trẻ em mầm non, học sinh theo quy định."

26.7:
  code_name: 7
  full_name: "Phạt tiền từ 5.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 10.000.000 đồng đến 12.000.000 đồng đối với tổ chức kinh doanh vận tải, dịch vụ hỗ trợ vận tải thực hiện một trong các hành vi vi phạm sau đây:"

26.7.a:
  code_name: a
  full_name: "Không thực hiện việc cung cấp, cập nhật, truyền, lưu trữ, quản lý thông tin, dữ liệu từ thiết bị giám sát hành trình theo quy định;"

26.7.b:
  code_name: b
  full_name: "Không thực hiện đúng nội dung thông tin đã niêm yết trên xe theo quy định;"

26.7.c:
  code_name: c
  full_name: "Sử dụng phương tiện kinh doanh vận tải không lắp thiết bị giám sát hành trình của xe (đối với hình thức kinh doanh vận tải có quy định phương tiện phải lắp thiết bị) hoặc lắp thiết bị nhưng thiết bị không hoạt động, không đúng quy chuẩn theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình của xe ô tô;"

26.7.d:
  code_name: d
  full_name: "Sử dụng xe trung chuyển chở hành khách không đúng quy định;"

26.7.đ:
  code_name: đ
  full_name: "Sử dụng lái xe điều khiển xe khách giường nằm hai tầng, xe ô tô đưa đón trẻ em mầm non, học sinh chưa đủ số năm kinh nghiệm theo quy định;"

26.7.e:
  code_name: e
  full_name: "Sử dụng xe kinh doanh vận tải hành khách theo hợp đồng mà trên xe không có hợp đồng vận tải, danh sách hành khách kèm theo, thiết bị để truy cập nội dung hợp đồng điện tử và danh sách hành khách theo quy định hoặc có hợp đồng vận tải, danh sách hành khách, thiết bị để truy cập nhưng không bảo đảm yêu cầu theo quy định, chở người không có tên trong danh sách hành khách hoặc vận chuyển không đúng đối tượng theo quy định (đối với xe kinh doanh vận tải hành khách theo hợp đồng vận chuyển trẻ em mầm non, học sinh, sinh viên, cán bộ, công chức, viên chức, công nhân);"

26.7.g:
  code_name: g
  full_name: "Sử dụng xe ô tô kinh doanh vận tải không lắp thiết bị ghi nhận hình ảnh người lái xe theo quy định (đối với loại xe có quy định phải lắp thiết bị ghi nhận hình ảnh người lái xe) hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không ghi, không lưu trữ được dữ liệu trên xe trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô;"

26.7.h:
  code_name: h
  full_name: "Không thực hiện việc cung cấp, cập nhật, truyền dẫn, lưu trữ, quản lý thông tin, dữ liệu thu thập từ thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô theo quy định;"

26.7.i:
  code_name: i
  full_name: "Sử dụng phương tiện kinh doanh vận tải có niên hạn sử dụng không bảo đảm điều kiện của hình thức kinh doanh đã đăng ký."

26.8:
  code_name: 8
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với cá nhân, từ 20.000.000 đồng đến 24.000.000 đồng đối với tổ chức kinh doanh vận tải, dịch vụ hỗ trợ vận tải thực hiện một trong các hành vi vi phạm sau đây:"

26.8.a:
  code_name: a
  full_name: "Không tổ chức khám sức khỏe định kỳ cho lái xe theo quy định hoặc có tổ chức khám nhưng không đầy đủ các nội dung theo quy định;"

26.8.b:
  code_name: b
  full_name: "Vi phạm quy định về kinh doanh, điều kiện kinh doanh vận tải bằng xe ô tô để xảy ra tai nạn giao thông gây hậu quả từ mức nghiêm trọng trở lên;"

26.8.c:
  code_name: c
  full_name: "Sử dụng xe ô tô kinh doanh vận tải để đón, trả khách; nhận, trả hàng trên đường cao tốc."

26.9:
  code_name: 9
  full_name: "Phạt tiền từ 20.000.000 đồng đến 40.000.000 đồng đối với đơn vị sản xuất, lắp ráp, nhập khẩu thiết bị giám sát hành trình của xe ô tô, đơn vị cung cấp dịch vụ liên quan đến giám sát hành trình, ghi nhận hình ảnh người lái xe thực hiện một trong các hành vi sau:"

26.9.a:
  code_name: a
  full_name: "Đơn vị sản xuất, lắp ráp, nhập khẩu thiết bị giám sát hành trình của xe ô tô không có nhân sự cho từng vị trí công việc theo quy định;"

26.9.b:
  code_name: b
  full_name: "Đơn vị sản xuất, lắp ráp, nhập khẩu thiết bị giám sát hành trình của xe ô tô không báo cáo về việc cập nhật, thay đổi phần mềm của thiết bị theo quy định."

"26.10":
  code_name: 10
  full_name: "Phạt tiền từ 40.000.000 đồng đến 60.000.000 đồng đối với đơn vị sản xuất, lắp ráp, nhập khẩu thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô, đơn vị cung cấp dịch vụ liên quan đến giám sát hành trình, ghi nhận hình ảnh người lái xe thực hiện một trong các hành vi vi phạm sau đây:"

26.10.a:
  code_name: a
  full_name: "Làm sai lệch thông tin, dữ liệu của thiết bị giám sát hành trình của xe ô tô;"

26.10.b:
  code_name: b
  full_name: "Làm sai lệch thông tin, dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô."

26.11:
  code_name: 11
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với cá nhân, từ 80.000.000 đồng đến 100.000.000 đồng đối với tổ chức kinh doanh vận tải, dịch vụ hỗ trợ vận tải tái phạm hành vi quy định tại điểm a, điểm h khoản 7 Điều này."

26.12:
  code_name: 12
  full_name: "Ngoài việc bị phạt tiền, cá nhân, tổ chức thực hiện hành vi vi phạm quy định tại điểm c khoản 2; điểm a, điểm b, điểm đ, điểm g khoản 4; điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g khoản 7; điểm c khoản 8 Điều này còn bị áp dụng các hình thức xử phạt bổ sung tước quyền sử dụng phù hiệu từ 01 tháng đến 03 tháng (nếu có hoặc đã được cấp) đối với xe vi phạm."

26.13:
  code_name: 13
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng các biện pháp khắc phục hậu quả sau đây:"

26.13.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 4 Điều này buộc cấp thẻ nhận dạng lái xe cho lái xe theo quy định;"

26.13.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm b, điểm c, điểm d khoản 4; điểm a khoản 8 Điều này buộc tổ chức tập huấn, hướng dẫn nghiệp vụ, quy trình hoặc tổ chức khám sức khỏe định kỳ cho lái xe và nhân viên phục vụ trên xe theo quy định;"

26.13.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm đ, điểm e khoản 4; điểm c, điểm g khoản 7 Điều này buộc lắp đặt thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe, dây đai an toàn, ghế ngồi cho trẻ em mầm non, học sinh tiểu học trên xe theo đúng quy định;"

26.13.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm h khoản 7; khoản 11 Điều này buộc cung cấp, cập nhật, truyền dẫn, lưu trữ, quản lý thông tin, dữ liệu thu thập từ thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô theo quy định;"

26.13.đ:
  code_name: đ
  full_name: "Thực hiện hành vi quy định tại điểm c, điểm d khoản 6 Điều này buộc thực hiện đúng quy định về màu sơn, biển báo dấu hiệu nhận biết của xe."

26.14:
  code_name: 14
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

26.14.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm đ khoản 2; điểm b, điểm c, điểm d khoản 6; điểm b, điểm c, điểm e, điểm i khoản 7 Điều này trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 02 điểm;"

26.14.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm c khoản 8 Điều này trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 06 điểm."

27:
  code_name: 27
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh

27.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với người điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh thực hiện một trong các hành vi vi phạm sau đây:"

27.1.a:
  code_name: a
  full_name: "Không hướng dẫn trẻ em mầm non, học sinh ngồi đúng vị trí quy định trong xe;"

27.1.b:
  code_name: b
  full_name: "Điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh tiểu học, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh tiểu học không có dây đai an toàn phù hợp với lứa tuổi hoặc không có ghế ngồi phù hợp với lứa tuổi theo quy định;"

27.1.c:
  code_name: c
  full_name: "Điều khiển xe không lắp thiết bị ghi nhận hình ảnh người lái xe hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô."

27.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh tiểu học, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh tiểu học không có hoặc không đủ người quản lý trên mỗi xe ô tô theo quy định tại khoản 3 Điều 46 của Luật Trật tự, an toàn giao thông đường bộ."

27.3:
  code_name: 3
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với người điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh thực hiện một trong các hành vi vi phạm sau đây:"

27.3.a:
  code_name: a
  full_name: "Điều khiển xe không có thiết bị giám sát hành trình hoặc có lắp thiết bị giám sát hành trình nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình lắp trên xe ô tô;"

27.3.b:
  code_name: b
  full_name: "Điều khiển xe không có thiết bị ghi nhận hình ảnh trẻ em mầm non, học sinh hoặc không có thiết bị có chức năng cảnh báo, chống bỏ quên trẻ em trên xe hoặc không có thiết bị ghi nhận hình ảnh trẻ em mầm non, học sinh và thiết bị có chức năng cảnh báo, chống bỏ quên trẻ em trên xe;"

27.3.c:
  code_name: c
  full_name: "Điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh không có màu sơn theo quy định;"

27.3.d:
  code_name: d
  full_name: "Điều khiển xe ô tô kinh doanh vận tải chở trẻ em mầm non, học sinh, xe ô tô kinh doanh vận tải kết hợp với hoạt động đưa đón trẻ em mầm non, học sinh không có biển báo dấu hiệu nhận biết là xe chở trẻ em mầm non, học sinh theo quy định."

27.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi quy định tại khoản 2, khoản 3 Điều này bị trừ điểm giấy phép lái xe 02 điểm."

28:
  code_name: 28
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ

28.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi chở quá số người quy định được phép chở của phương tiện."

28.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi điều khiển xe chở người bốn bánh có gắn động cơ kinh doanh vận tải, xe chở hàng bốn bánh có gắn động cơ kinh doanh vận tải không có hoặc không gắn phù hiệu theo quy định hoặc có nhưng đã hết giá trị sử dụng hoặc sử dụng phù hiệu không do cơ quan có thẩm quyền cấp."

28.3:
  code_name: 3
  full_name: "Phạt tiền từ 8.000.000 đồng đến 12.000.000 đồng đối với hành vi điều khiển xe hoạt động không đúng tuyến đường, lịch trình, thời gian được phép hoạt động hoặc phạm vi hoạt động theo quy định, trừ hành vi vi phạm quy định tại điểm b khoản 7 Điều 6 của Nghị định này."

28.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

28.4.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 2 Điều này bị trừ điểm giấy phép lái xe 02 điểm;"

28.4.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại khoản 3 Điều này bị trừ điểm giấy phép lái xe 06 điểm."

29:
  code_name: 29
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe cứu hộ giao thông đường bộ

29.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi vi phạm điều khiển xe ô tô cứu hộ giao thông đường bộ không lắp thiết bị ghi nhận hình ảnh người lái xe hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô."

29.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi vi phạm điều khiển xe ô tô cứu hộ giao thông đường bộ không có dụng cụ, thiết bị chuyên dùng để cứu hộ, hỗ trợ cứu hộ theo quy định."

29.3:
  code_name: 3
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với hành vi vi phạm điều khiển xe ô tô cứu hộ giao thông đường bộ không lắp thiết bị giám sát hành trình hoặc có lắp thiết bị giám sát hành trình nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình lắp trên xe ô tô."

29.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi quy định tại khoản 3 Điều này bị trừ điểm giấy phép lái xe 02 điểm."

30:
  code_name: 30
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển xe cứu thương

30.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi vi phạm điều khiển xe ô tô cứu thương không lắp thiết bị ghi nhận hình ảnh người lái xe hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô."

30.2:
  code_name: 2
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với hành vi vi phạm điều khiển xe ô tô cứu thương không lắp thiết bị giám sát hành trình hoặc có lắp thiết bị giám sát hành trình nhưng không có tác dụng trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình lắp trên xe ô tô."

30.3:
  code_name: 3
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi quy định tại khoản 2 Điều này bị trừ điểm giấy phép lái xe 02 điểm."

II.5:
  code_name: c
  full_name: "CÁC VI PHẠM KHÁC LIÊN QUAN ĐẾN TRẬT TỰ, AN TOÀN GIAO THÔNG TRONG LĨNH VỰC GIAO THÔNG ĐƯỜNG BỘ"

31:
  code_name: 31
  full_name: Xử phạt hành vi sản xuất, lắp ráp trái phép phương tiện giao thông cơ giới đường bộ; sản xuất, mua, bán biển số xe trái phép

31.1:
  code_name: 1
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với cá nhân, từ 20.000.000 đồng đến 24.000.000 đồng đối với tổ chức thực hiện hành vi mua, bán biển số xe không phải là biển số do cơ quan nhà nước có thẩm quyền sản xuất hoặc không được cơ quan nhà nước có thẩm quyền cho phép."

31.2:
  code_name: 2
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với cá nhân, từ 80.000.000 đồng đến 100.000.000 đồng đối với tổ chức thực hiện hành vi sản xuất biển số trái phép hoặc sản xuất, lắp ráp trái phép phương tiện giao thông cơ giới đường bộ."

31.3:
  code_name: 3
  full_name: "Ngoài việc bị phạt tiền, cá nhân, tổ chức thực hiện hành vi vi phạm quy định tại khoản 1, khoản 2 Điều này còn bị áp dụng hình thức xử phạt bổ sung tịch thu biển số, phương tiện sản xuất, lắp ráp trái phép."

31.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi quy định tại khoản 1, khoản 2 Điều này còn bị áp dụng biện pháp khắc phục hậu quả buộc nộp lại số lợi bất hợp pháp có được do thực hiện vi phạm hành chính."

32:
  code_name: 32
  full_name: Xử phạt, trừ điểm giấy phép lái xe đối với chủ phương tiện vi phạm quy định liên quan đến giao thông đường bộ

32.1:
  code_name: 1
  full_name: "Phạt tiền từ 200.000 đồng đến 300.000 đồng đối với cá nhân, từ 400.000 đồng đến 600.000 đồng đối với tổ chức là chủ xe mô tô, xe gắn máy và các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

32.1.a:
  code_name: a
  full_name: "Tự ý thay đổi nhãn hiệu, màu sơn của xe không đúng với chứng nhận đăng ký xe;"

32.1.b:
  code_name: b
  full_name: "Đưa phương tiện không có giấy chứng nhận kiểm định khí thải xe mô tô, xe gắn máy hoặc có nhưng đã hết hạn sử dụng hoặc sử dụng giấy chứng nhận kiểm định khí thải xe mô tô, xe gắn máy không do cơ quan có thẩm quyền cấp."

32.2:
  code_name: 2
  full_name: "Phạt tiền từ 300.000 đồng đến 400.000 đồng đối với cá nhân, từ 600.000 đồng đến 800.000 đồng đối với tổ chức là chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.2.a:
  code_name: a
  full_name: "Lắp kính chắn gió, kính cửa của xe không phải là loại kính an toàn;"

32.2.b:
  code_name: b
  full_name: "Không làm thủ tục khai báo với cơ quan đăng ký xe theo quy định trước khi cải tạo xe (đối với loại xe có quy định phải làm thủ tục khai báo)."

32.3:
  code_name: 3
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với cá nhân, từ 1.600.000 đồng đến 2.000.000 đồng đối với tổ chức là chủ xe mô tô, xe gắn máy và các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

32.3.a:
  code_name: a
  full_name: "Không làm thủ tục cấp chứng nhận đăng ký xe, biển số xe trong trường hợp thay đổi chủ xe theo quy định;"

32.3.b:
  code_name: b
  full_name: "Không làm thủ tục đổi chứng nhận đăng ký xe, biển số xe theo quy định;"

32.3.c:
  code_name: c
  full_name: "Lắp đặt, sử dụng thiết bị âm thanh, ánh sáng trên xe gây mất trật tự, an toàn giao thông đường bộ."

32.4:
  code_name: 4
  full_name: "Phạt tiền từ 800.000 đồng đến 1.000.000 đồng đối với cá nhân, từ 1.600.000 đồng đến 2.000.000 đồng đối với tổ chức là chủ xe mô tô, xe gắn máy và các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy không thực hiện đúng quy định về biển số, trừ các hành vi vi phạm quy định tại điểm g, điểm h khoản 8 Điều này."

32.5:
  code_name: 5
  full_name: "Phạt tiền từ 800.000 đồng đến 1.200.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 75.000.000 đồng đối với chủ phương tiện là cá nhân, từ 1.600.000 đồng đến 2.400.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 150.000.000 đồng đối với chủ phương tiện là tổ chức giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 20 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 20 của Nghị định này."

32.6:
  code_name: 6
  full_name: "Phạt tiền từ 2.000.000 đồng đến 4.000.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 75.000.000 đồng đối với chủ phương tiện là cá nhân, từ 4.000.000 đồng đến 8.000.000 đồng trên mỗi người vượt quá quy định được phép chở của phương tiện nhưng tổng mức phạt tiền tối đa không vượt quá 150.000.000 đồng đối với chủ phương tiện là tổ chức giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 4 Điều 20 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 4 Điều 20 của Nghị định này."

32.7:
  code_name: 7
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 8.000.000 đồng đến 12.000.000 đồng đối với tổ chức là chủ xe ô tô (kể cả rơ moóc và sơ mi rơ moóc), xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.7.a:
  code_name: a
  full_name: "Tẩy xóa, sửa chữa hoặc giả mạo hồ sơ đăng ký xe nhưng chưa đến mức truy cứu trách nhiệm hình sự;"

32.7.b:
  code_name: b
  full_name: "Không làm thủ tục thu hồi chứng nhận đăng ký xe; biển số xe; giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường theo quy định;"

32.7.c:
  code_name: c
  full_name: "Không làm thủ tục đổi chứng nhận đăng ký xe, biển số xe theo quy định;"

32.7.d:
  code_name: d
  full_name: "Khai báo không đúng sự thật hoặc sử dụng các giấy tờ, tài liệu giả để được cấp lại biển số xe, chứng nhận đăng ký xe, giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường nhưng chưa đến mức bị truy cứu trách nhiệm hình sự;"

32.7.đ:
  code_name: đ
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm e khoản 3; điểm i khoản 5 Điều 20 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm e khoản 3; điểm i khoản 5 Điều 20 của Nghị định này;"

32.7.e:
  code_name: e
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm d khoản 2 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm d khoản 2 Điều 21 của Nghị định này;"

32.7.g:
  code_name: g
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 2 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 2 Điều 21 của Nghị định này;"

32.7.h:
  code_name: h
  full_name: "Không làm thủ tục cấp chứng nhận đăng ký xe, biển số xe trong trường hợp thay đổi chủ xe theo quy định;"

32.7.i:
  code_name: i
  full_name: "Tự ý thay đổi màu sơn của xe không đúng với màu sơn ghi trong chứng nhận đăng ký xe;"

32.7.k:
  code_name: k
  full_name: "Lắp đặt, sử dụng thiết bị âm thanh, ánh sáng trên xe gây mất trật tự, an toàn giao thông đường bộ;"

32.7.l:
  code_name: l
  full_name: "Cố ý can thiệp làm sai lệch chỉ số trên đồng hồ báo quãng đường đã chạy của xe ô tô;"

32.7.m:
  code_name: m
  full_name: "Đưa xe cứu hộ giao thông đường bộ, xe cứu thương không lắp thiết bị giám sát hành trình của xe hoặc lắp thiết bị nhưng thiết bị không hoạt động, không đúng quy chuẩn theo quy định hoặc làm sai lệch dữ liệu của thiết bị giám sát hành trình trên xe ô tô tham gia giao thông;"

32.7.n:
  code_name: n
  full_name: "Đưa xe cứu hộ giao thông đường bộ, xe cứu thương không lắp thiết bị ghi nhận hình ảnh người lái xe theo quy định hoặc có lắp thiết bị ghi nhận hình ảnh người lái xe nhưng không ghi, không lưu trữ được dữ liệu trên xe trong quá trình xe tham gia giao thông theo quy định hoặc làm sai lệch dữ liệu của thiết bị ghi nhận hình ảnh người lái xe lắp trên xe ô tô tham gia giao thông;"

32.7.o:
  code_name: o
  full_name: "Đưa xe cứu hộ giao thông đường bộ không có dụng cụ, thiết bị chuyên dùng để cứu hộ, hỗ trợ cứu hộ theo quy định tham gia giao thông."

32.8:
  code_name: 8
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 8.000.000 đến 12.000.000 đồng đối với tổ chức là chủ xe mô tô, xe gắn máy và các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

32.8.a:
  code_name: a
  full_name: "Tẩy xóa, sửa chữa hoặc giả mạo hồ sơ đăng ký xe nhưng chưa đến mức truy cứu trách nhiệm hình sự;"

32.8.b:
  code_name: b
  full_name: "Tự ý thay đổi khung, máy, hình dáng, kích thước, đặc tính của xe;"

32.8.c:
  code_name: c
  full_name: "Khai báo không đúng sự thật hoặc sử dụng các giấy tờ, tài liệu giả để được cấp lại biển số xe, chứng nhận đăng ký xe nhưng chưa đến mức bị truy cứu trách nhiệm hình sự;"

32.8.d:
  code_name: d
  full_name: "Không làm thủ tục thu hồi chứng nhận đăng ký xe, biển số xe theo quy định;"

32.8.đ:
  code_name: đ
  full_name: "Đưa phương tiện không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) tham gia giao thông hoặc có nhưng đã hết hạn sử dụng, hết hiệu lực; đưa phương tiện có chứng nhận đăng ký xe tạm thời, phương tiện có phạm vi hoạt động hạn chế tham gia giao thông quá thời hạn, tuyến đường, phạm vi cho phép;"

32.8.e:
  code_name: e
  full_name: "Đưa phương tiện có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) nhưng không do cơ quan có thẩm quyền cấp hoặc bị tẩy xóa tham gia giao thông; đưa phương tiện có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) nhưng không đúng với số khung, số động cơ (số máy) của xe tham gia giao thông;"

32.8.g:
  code_name: g
  full_name: "Lắp đặt, sử dụng thiết bị thay đổi biển số trên xe trái quy định;"

32.8.h:
  code_name: h
  full_name: "Đưa phương tiện không gắn biển số (đối với loại xe có quy định phải gắn biển số) tham gia giao thông; đưa phương tiện gắn biển số không đúng với chứng nhận đăng ký xe hoặc gắn biển số không do cơ quan có thẩm quyền cấp tham gia giao thông."

32.9:
  code_name: 9
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với cá nhân, từ 8.000.000 đồng đến 12.000.000 đồng đối với tổ chức là chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.9.a:
  code_name: a
  full_name: "Thuê, mượn linh kiện, phụ kiện của xe ô tô khi kiểm định;"

32.9.b:
  code_name: b
  full_name: "Đưa xe cơ giới, xe máy chuyên dùng có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường (đối với loại xe có quy định phải kiểm định) nhưng đã hết hiệu lực (hạn sử dụng) dưới 01 tháng (kể cả rơ moóc và sơ mi rơ moóc) tham gia giao thông;"

32.9.c:
  code_name: c
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 4 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 4 Điều 21 của Nghị định này;"

32.9.d:
  code_name: d
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm d khoản 6 Điều 20; điểm b khoản 5 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm d khoản 6 Điều 20; điểm b khoản 5 Điều 21 của Nghị định này;"

32.9.đ:
  code_name: đ
  full_name: "Đưa phương tiện có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe nhưng không do cơ quan có thẩm quyền cấp hoặc bị tẩy xóa tham gia giao thông; đưa phương tiện có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) nhưng không đúng với số khung, số động cơ (số máy) của xe (kể cả rơ moóc và sơ mi rơ moóc) tham gia giao thông;"

32.9.e:
  code_name: e
  full_name: "Không thực hiện đúng quy định về biển số, quy định về kẻ hoặc dán chữ, số biển số, thông tin trên thành xe, cửa xe (kể cả rơ moóc và sơ mi rơ moóc), trừ các hành vi vi phạm quy định tại điểm b, điểm c khoản 12; điểm d khoản 13 Điều này và các hành vi vi phạm quy định tại điểm b khoản 3 Điều 39 của Nghị định này."

"32.10":
  code_name: 10
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với cá nhân, từ 16.000.000 đồng đến 20.000.000 đồng đối với tổ chức là chủ xe mô tô, xe gắn máy và các loại xe tương tự xe mô tô, các loại xe tương tự xe gắn máy thực hiện hành vi vi phạm giao xe hoặc để cho người không đủ điều kiện theo quy định tại khoản 1 Điều 56 của Luật Trật tự, an toàn giao thông đường bộ điều khiển xe tham gia giao thông (bao gồm cả trường hợp người điều khiển phương tiện có giấy phép lái xe nhưng đang trong thời gian bị tước quyền sử dụng)."

32.11:
  code_name: 11
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với cá nhân, từ 20.000.000 đồng đến 24.000.000 đồng đối với tổ chức là chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.11.a:
  code_name: a
  full_name: "Đưa xe cơ giới, xe máy chuyên dùng không có giấy chứng nhận hoặc tem kiểm định an toàn kỹ thuật và bảo vệ môi trường (đối với loại xe có quy định phải kiểm định) hoặc có nhưng đã hết hiệu lực (hạn sử dụng) từ 01 tháng trở lên (kể cả rơ moóc và sơ mi rơ moóc) tham gia giao thông;"

32.11.b:
  code_name: b
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm d khoản 5 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm d khoản 5 Điều 21 của Nghị định này;"

32.11.c:
  code_name: c
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 34 của Nghị định này;"

32.11.d:
  code_name: d
  full_name: "Đưa xe ô tô kinh doanh vận tải hành khách lắp thêm hoặc tháo bớt ghế, giường nằm hoặc có kích thước khoang chở hành lý (hầm xe) không đúng với thông số kỹ thuật được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe tham gia giao thông;"

32.11.đ:
  code_name: đ
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 7 Điều 20; điểm c khoản 6 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 7 Điều 20; điểm c khoản 6 Điều 21 của Nghị định này."

32.12:
  code_name: 12
  full_name: "Phạt tiền từ 16.000.000 đồng đến 18.000.000 đồng đối với cá nhân, từ 32.000.000 đồng đến 36.000.000 đồng đối với tổ chức là chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô, phương tiện giao thông thông minh thực hiện một trong các hành vi vi phạm sau đây:"

32.12.a:
  code_name: a
  full_name: "Đưa phương tiện không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) tham gia giao thông hoặc có nhưng đã hết hạn sử dụng, hết hiệu lực; đưa phương tiện có chứng nhận đăng ký xe tạm thời, phương tiện có phạm vi hoạt động hạn chế tham gia giao thông quá thời hạn, tuyến đường, phạm vi cho phép;"

32.12.b:
  code_name: b
  full_name: "Đưa phương tiện không gắn biển số (đối với loại xe có quy định phải gắn biển số) tham gia giao thông;"

32.12.c:
  code_name: c
  full_name: "Lắp đặt, sử dụng thiết bị thay đổi biển số trên xe trái quy định (kể cả rơ moóc và sơ mi rơ moóc);"

32.12.d:
  code_name: d
  full_name: "Đưa phương tiện giao thông thông minh không có giấy phép hoạt động hoặc giấy phép hoạt động hết hạn sử dụng hoặc hoạt động không đúng nội dung ghi trong giấy phép tham gia giao thông."

32.13:
  code_name: 13
  full_name: "Phạt tiền từ 20.000.000 đồng đến 26.000.000 đồng đối với cá nhân, từ 40.000.000 đồng đến 52.000.000 đồng đối với tổ chức là chủ xe ô tô, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.13.a:
  code_name: a
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm b khoản 6 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm b khoản 6 Điều 21 của Nghị định này;"

32.13.b:
  code_name: b
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 22 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2 Điều 22 của Nghị định này;"

32.13.c:
  code_name: c
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 3 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 3 Điều 34 của Nghị định này;"

32.13.d:
  code_name: d
  full_name: "Đưa phương tiện gắn biển số không đúng với chứng nhận đăng ký xe hoặc gắn biển số không do cơ quan có thẩm quyền cấp (kể cả rơ moóc và sơ mi rơ moóc) tham gia giao thông;"

32.13.đ:
  code_name: đ
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 10 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 10 Điều 21 của Nghị định này."

32.14:
  code_name: 14
  full_name: "Phạt tiền từ 28.000.000 đồng đến 30.000.000 đồng đối với cá nhân, từ 56.000.000 đồng đến 60.000.000 đồng đối với tổ chức là chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

32.14.a:
  code_name: a
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 3 Điều 22 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 3 Điều 22 của Nghị định này;"

32.14.b:
  code_name: b
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 3 Điều 22 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 3 Điều 22 của Nghị định này;"

32.14.c:
  code_name: c
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm c khoản 3 Điều 22 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm c khoản 3 Điều 22 của Nghị định này;"

32.14.d:
  code_name: d
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm d khoản 3 Điều 22 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm d khoản 3 Điều 22 của Nghị định này;"

32.14.đ:
  code_name: đ
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 4 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 4 Điều 34 của Nghị định này;"

32.14.e:
  code_name: e
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 4 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 4 Điều 34 của Nghị định này;"

32.14.g:
  code_name: g
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm c khoản 4 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm c khoản 4 Điều 34 của Nghị định này;"

32.14.h:
  code_name: h
  full_name: "Đưa xe ô tô tải (kể cả rơ moóc và sơ mi rơ moóc) có kích thước thùng xe không đúng với thông số kỹ thuật được ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe tham gia giao thông;"

32.14.i:
  code_name: i
  full_name: "Giao xe hoặc để cho người không đủ điều kiện theo quy định tại khoản 1 Điều 56 (đối với xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ và các loại xe tương tự xe ô tô), khoản 2 Điều 56 (đối với xe máy chuyên dùng) của Luật Trật tự, an toàn giao thông đường bộ điều khiển xe tham gia giao thông (bao gồm cả trường hợp người điều khiển phương tiện có giấy phép lái xe nhưng đã hết hạn sử dụng hoặc đang trong thời gian bị tước quyền sử dụng; chứng chỉ bồi dưỡng kiến thức pháp luật về giao thông đường bộ bị tước quyền sử dụng trước ngày 01/01/2025 và đang trong thời gian bị tước)."

32.15:
  code_name: 15
  full_name: "Phạt tiền từ 30.000.000 đồng đến 40.000.000 đồng đối với cá nhân, từ 60.000.000 đồng đến 80.000.000 đồng đối với tổ chức là chủ xe ô tô, xe máy chuyên dùng và các loại xe tương tự xe ô tô khi giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 7 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 7 Điều 21 của Nghị định này."

32.16:
  code_name: 16
  full_name: "Phạt tiền từ 65.000.000 đồng đến 75.000.000 đồng đối với cá nhân, từ 130.000.000 đồng đến 150.000.000 đồng đối với tổ chức là chủ xe ô tô, xe máy chuyên dùng và các loại xe tương tự xe ô tô khi thực hiện một trong các hành vi vi phạm sau đây:"

32.16.a:
  code_name: a
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 5 Điều 34 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a khoản 5 Điều 34 của Nghị định này;"

32.16.b:
  code_name: b
  full_name: "Giao phương tiện hoặc để cho người làm công, người đại diện điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm b khoản 8 Điều 21 của Nghị định này hoặc trực tiếp điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm a, điểm b khoản 8 Điều 21 của Nghị định này;"

32.16.c:
  code_name: c
  full_name: "Tự ý thay đổi tổng thành khung, tổng thành máy (động cơ), hệ thống phanh, hệ thống truyền động (truyền lực), hệ thống chuyển động hoặc tự ý cải tạo kết cấu, hình dáng, kích thước của xe không đúng thiết kế của nhà sản xuất hoặc thiết kế trong hồ sơ đã nộp cho cơ quan đăng ký xe hoặc thiết kế cải tạo đã được cơ quan có thẩm quyền phê duyệt; tự ý thay đổi tính năng sử dụng của xe hoặc tự ý lắp đặt thêm cơ cấu nâng hạ thùng xe, nâng hạ công-ten-nơ trên xe (kể cả rơ moóc và sơ mi rơ moóc)."

32.17:
  code_name: 17
  full_name: "Tịch thu phương tiện đối với chủ xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ, xe máy chuyên dùng, xe mô tô, xe gắn máy và các loại xe tương tự xe ô tô, xe mô tô, xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

32.17.a:
  code_name: a
  full_name: "Cắt, hàn, tẩy xoá, đục sửa, đóng lại trái phép số khung, số động cơ (số máy); đưa phương tiện đã bị cắt, hàn, tẩy xoá, đục sửa, đóng lại trái phép số khung, số động cơ (số máy) tham gia giao thông;"

32.17.b:
  code_name: b
  full_name: "Cải tạo xe ô tô loại khác thành xe ô tô chở người;"

32.17.c:
  code_name: c
  full_name: "Đưa phương tiện quá niên hạn sử dụng tham gia giao thông, trừ hành vi vi phạm quy định tại điểm i khoản 7 Điều 26 của Nghị định này;"

32.17.d:
  code_name: d
  full_name: "Tái phạm hành vi quy định tại khoản 5 Điều này (trong trường hợp chở vượt trên 100% số người quy định được phép chở của phương tiện);"

32.17.đ:
  code_name: đ
  full_name: "Tái phạm hành vi quy định tại khoản 6 Điều này (trong trường hợp chở vượt trên 100% số người quy định được phép chở của phương tiện);"

32.17.e:
  code_name: e
  full_name: "Tái phạm hành vi quy định tại điểm h khoản 14 Điều này;"

32.17.g:
  code_name: g
  full_name: "Tái phạm hành vi quy định tại điểm b khoản 16 Điều này."

32.18:
  code_name: 18
  full_name: "Ngoài việc bị phạt tiền, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung như sau:"

32.18.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm g, điểm h khoản 8; điểm c khoản 12; điểm d khoản 13 Điều này bị tịch thu biển số; tịch thu biển số, thiết bị thay đổi biển số;"

32.18.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm đ, điểm e khoản 8; điểm đ khoản 9; điểm a khoản 12 Điều này trong trường hợp không có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) hoặc có chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) nhưng không do cơ quan có thẩm quyền cấp, không đúng số khung, số động cơ (số máy) của xe hoặc bị tẩy xóa (kể cả rơ moóc và sơ mi rơ moóc) mà không chứng minh được nguồn gốc xuất xứ của phương tiện (không có giấy tờ, chứng nhận nguồn gốc xe, chứng nhận quyền sở hữu hợp pháp) thì bị tịch thu phương tiện;"

32.18.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm e khoản 7, điểm b khoản 11, điểm a khoản 13, khoản 15, điểm b khoản 16 Điều này mà phương tiện đó có thùng xe, khối lượng hàng hóa cho phép chuyên chở không đúng theo quy định hiện hành thì còn bị tước quyền sử dụng giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường và tem kiểm định của phương tiện từ 01 tháng đến 03 tháng;"

32.18.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm d khoản 11, điểm h khoản 14, điểm c khoản 16 Điều này bị tước quyền sử dụng giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường và tem kiểm định của phương tiện từ 01 tháng đến 03 tháng;"

32.18.đ:
  code_name: đ
  full_name: "Thực hiện hành vi quy định tại khoản 5, khoản 6 Điều này trong trường hợp chở vượt trên 50% số người quy định được phép chở của phương tiện còn bị tước quyền sử dụng phù hiệu từ 01 tháng đến 03 tháng (nếu có). Thực hiện hành vi quy định tại điểm e, điểm g khoản 7; điểm a, điểm b khoản 11; điểm a, điểm b, điểm c, điểm đ khoản 13; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g khoản 14; khoản 15; khoản 16 Điều này còn bị tước quyền sử dụng phù hiệu từ 01 tháng đến 03 tháng (nếu có),"

32.19:
  code_name: 19
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng các biện pháp khắc phục hậu quả sau đây:"

32.19.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 1, điểm i khoản 7 Điều này buộc khôi phục lại nhãn hiệu, màu sơn ghi trong chứng nhận đăng ký xe theo quy định;"

32.19.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 2 Điều này buộc thay thế thiết bị đủ tiêu chuẩn an toàn kỹ thuật theo quy định (lắp đúng loại kính an toàn);"

32.19.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại khoản 4, điểm e khoản 9 Điều này buộc thực hiện đúng quy định về biển số xe, quy định về kẻ hoặc dán chữ, số biển số, thông tin trên thành xe, cửa xe;"

32.19.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm d khoản 11, điểm h khoản 14, điểm c khoản 16 Điều này buộc khôi phục lại hình dáng, kích thước, tình trạng an toàn kỹ thuật ban đầu của xe và đăng kiểm lại trước khi đưa phương tiện ra tham gia giao thông;"

32.19.đ:
  code_name: đ
  full_name: "Thực hiện hành vi quy định tại điểm e khoản 7, điểm b khoản 11, điểm a khoản 13, khoản 15, điểm b khoản 16 Điều này mà phương tiện đó có thùng xe, khối lượng hàng hóa cho phép chuyên chở không đúng theo quy định hiện hành thì còn bị buộc thực hiện điều chỉnh thùng xe theo đúng quy định hiện hành, đăng kiểm lại và điều chỉnh lại khối lượng hàng hóa cho phép chuyên chở ghi trong giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường theo quy định hiện hành trước khi đưa phương tiện ra tham gia giao thông;"

32.19.e:
  code_name: e
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm đ, điểm e, điểm g khoản 7; điểm c khoản 9; điểm b, điểm c khoản 11; điểm a, điểm b, điểm c khoản 13; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g khoản 14; khoản 15; điểm a, điểm b khoản 16 Điều này nếu gây hư hại cầu, đường phải khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra;"

32.19.g:
  code_name: g
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm b khoản 3; điểm b, điểm c, điểm h khoản 7; điểm d, điểm đ khoản 8; điểm a khoản 12 Điều này buộc làm thủ tục đổi, thu hồi, cấp mới, cấp chứng nhận đăng ký xe, biển số xe, giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường theo quy định (trừ trường hợp bị tịch thu phương tiện);"

32.19.h:
  code_name: h
  full_name: "Thực hiện hành vi quy định tại điểm c khoản 3, điểm k khoản 7 Điều này buộc tháo dỡ thiết bị âm thanh, ánh sáng lắp đặt trên xe gây mất trật tự, an toàn giao thông đường bộ;"

32.19.i:
  code_name: i
  full_name: "Thực hiện hành vi quy định tại điểm e khoản 8, điểm đ khoản 9 Điều này buộc nộp lại chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe bị tẩy xóa;"

32.19.k:
  code_name: k
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm l khoản 7 Điều này buộc điều chỉnh lại chỉ số trên đồng hồ báo quãng đường của xe ô tô bị làm sai lệch;"

32.19.l:
  code_name: l
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm o khoản 7 Điều này buộc lắp đặt dụng cụ, thiết bị chuyên dùng để cứu hộ, hỗ trợ cứu hộ trên xe theo đúng quy định."

"32.20":
  code_name: 20
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi vi phạm quy định tại điểm a, điểm d khoản 7; điểm a, điểm e khoản 8; điểm đ khoản 9 Điều này bị thu hồi hồ sơ đăng ký xe bị tẩy xóa, sửa chữa hoặc giả mạo; giấy tờ, tài liệu giả để được cấp lại biển số xe, chứng nhận đăng ký xe, giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường; chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe) không do cơ quan có thẩm quyền cấp hoặc không đúng với số khung, số động cơ (số máy); giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe không do cơ quan có thẩm quyền cấp."

32.21:
  code_name: 21
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

32.21.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại điểm đ, điểm g, điểm m khoản 7; điểm đ, điểm e khoản 8; điểm b, điểm c, điểm d, điểm đ khoản 9; điểm a, điểm b, điểm đ khoản 11; điểm a khoản 12; điểm c khoản 13; điểm đ, điểm h khoản 14 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 02 điểm;"

32.21.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm e, điểm g khoản 14 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 03 điểm;"

32.21.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b, điểm đ khoản 13; điểm a, điểm b, điểm c, điểm d khoản 14; điểm a khoản 16 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 04 điểm;"

32.21.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại khoản 5, khoản 6 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện chở vượt trên 50% đến 100% số người quy định được phép chở của phương tiện, còn bị trừ điểm giấy phép lái xe 04 điểm;"

32.21.đ:
  code_name: đ
  full_name: "Thực hiện hành vi quy định tại điểm h khoản 8, điểm b khoản 12 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 06 điểm;"

32.21.e:
  code_name: e
  full_name: "Thực hiện hành vi quy định tại khoản 15 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 08 điểm;"

32.21.g:
  code_name: g
  full_name: "Thực hiện hành vi quy định tại điểm d khoản 13, điểm b khoản 16 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện còn bị trừ điểm giấy phép lái xe 10 điểm;"

32.21.h:
  code_name: h
  full_name: "Thực hiện hành vi quy định tại khoản 5, khoản 6 Điều này trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện chở vượt trên 100% số người quy định được phép chở của phương tiện còn bị trừ điểm giấy phép lái xe 10 điểm."

33:
  code_name: 33
  full_name: Xử phạt hành khách đi xe vi phạm quy định về trật tự, an toàn giao thông

33.1:
  code_name: 1
  full_name: "Phạt tiền từ 100.000 đồng đến 200.000 đồng đối với một trong các hành vi vi phạm sau đây:"

33.1.a:
  code_name: a
  full_name: "Không chấp hành hướng dẫn của lái xe, nhân viên phục vụ trên xe về các quy định bảo đảm trật tự, an toàn giao thông;"

33.1.b:
  code_name: b
  full_name: "Gây mất trật tự trên xe."

33.2:
  code_name: 2
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

33.2.a:
  code_name: a
  full_name: "Mang hóa chất độc hại, chất dễ cháy, nổ, hàng nguy hiểm hoặc hàng cấm lưu thông trên xe chở khách;"

33.2.b:
  code_name: b
  full_name: "Đu, bám vào thành xe; đứng, ngồi, nằm trên mui xe, nóc xe, trong khoang chở hành lý; tự ý mở cửa xe hoặc có hành vi khác không bảo đảm an toàn khi xe đang chạy."

33.3:
  code_name: 3
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với hành vi đe dọa, xâm phạm sức khỏe của người khác đi trên xe, lái xe, nhân viên phục vụ trên xe."

33.4:
  code_name: 4
  full_name: "Ngoài việc bị phạt tiền, người thực hiện hành vi vi phạm quy định tại điểm a khoản 2 Điều này còn bị áp dụng hình thức xử phạt bổ sung tịch thu hóa chất độc hại, chất dễ cháy, nổ, hàng nguy hiểm, hàng cấm lưu thông mang theo trên xe chở khách."

34:
  code_name: 34
  full_name: Xử phạt, trừ điểm giấy phép lái xe của người điều khiển quá khổ giới hạn, xe quá tải trọng, xe bánh xích lưu hành đường bộ (kể cả xe ô tô chở hành khách)

34.1:
  code_name: 1
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với hành vi không thực hiện đúng quy định trong giấy phép lưu hành, trừ các hành vi vi phạm quy định tại điểm a, điểm b khoản 3; điểm b, điểm c khoản 4 Điều này."

34.2:
  code_name: 2
  full_name: "Phạt tiền từ 4.000.000 đồng đến 6.000.000 đồng đối với hành vi điều khiển xe mà tổng trọng lượng (khối lượng toàn bộ) của xe vượt quá tải trọng cho phép của đường bộ trên 10% đến 20%, trừ trường hợp có giấy phép lưu hành còn giá trị sử dụng."

34.3:
  code_name: 3
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

34.3.a:
  code_name: a
  full_name: "Chở hàng vượt khổ giới hạn của xe hoặc của đường bộ ghi trong giấy phép lưu hành;"

34.3.b:
  code_name: b
  full_name: "Điều khiển xe bánh xích tham gia giao thông không có giấy phép lưu hành hoặc có giấy phép lưu hành nhưng không còn giá trị sử dụng theo quy định hoặc lưu thông trực tiếp trên đường mà không thực hiện biện pháp bảo vệ đường theo quy định;"

34.3.c:
  code_name: c
  full_name: "Điều khiển xe có kích thước bao ngoài vượt quá khép giới hạn của đường bộ hoặc chở hàng vượt khổ giới hạn của đường bộ hoặc chở hàng vượt quá kích thước giới hạn xếp hàng hóa của xe tham gia giao thông, trừ trường hợp có giấy phép lưu hành còn giá trị sử dụng;"

34.3.d:
  code_name: d
  full_name: "Điều khiển xe có kích thước bao ngoài vượt quá kích thước giới hạn cho phép của xe theo quy định, trừ trường hợp có giấy phép lưu hành còn giá trị sử dụng."

34.4:
  code_name: 4
  full_name: "Phạt tiền từ 13.000.000 đồng đến 15.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

34.4.a:
  code_name: a
  full_name: "Điều khiển xe mà tổng trọng lượng (khối lượng toàn bộ) của xe hoặc tải trọng trục xe (bao gồm cả hàng hóa xếp trên xe, người được chở trên xe) vượt quá tải trọng cho phép của đường bộ trên 20% đến 50%, trừ trường hợp có giấy phép lưu hành còn giá trị sử dụng;"

34.4.b:
  code_name: b
  full_name: "Điều khiển xe có giấy phép lưu hành còn giá trị sử dụng nhưng tổng trọng lượng (khối lượng toàn bộ) của xe hoặc tải trọng trục xe (bao gồm cả hàng hóa xếp trên xe nếu có) vượt quá quy định trong giấy phép lưu hành;"

34.4.c:
  code_name: c
  full_name: "Điều khiển xe có giấy phép lưu hành còn giá trị sử dụng nhưng đi không đúng tuyến đường quy định trong giấy phép lưu hành."

34.5:
  code_name: 5
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

34.5.a:
  code_name: a
  full_name: "Điều khiển xe mà tổng trọng lượng (khối lượng toàn bộ) của xe hoặc tải trọng trục xe (bao gồm cả hàng hóa xếp trên xe, người được chở trên xe) vượt quá tải trọng cho phép của đường bộ trên 50%, trừ trường hợp có giấy phép lưu hành còn giá trị sử dụng;"

34.5.b:
  code_name: b
  full_name: "Không chấp hành yêu cầu kiểm tra về trọng tải, tải trọng, khổ giới hạn xe, vận chuyển hàng siêu trường, siêu trọng của người thi hành công vụ; chuyển tải hoặc dùng các thủ đoạn khác để trốn tránh việc phát hiện xe chở quá tải, quá khổ."

34.6:
  code_name: 6
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 1, khoản 2, khoản 3, khoản 4, khoản 5 Điều này nếu gây hư hại cầu, đường còn bị áp dụng biện pháp khắc phục hậu quả buộc khôi phục lại tình trạng ban đầu đã bị thay đổi do vi phạm hành chính gây ra."

34.7:
  code_name: 7
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm còn bị trừ điểm giấy phép lái xe như sau:"

34.7.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 1, khoản 3, điểm a khoản 4 Điều này còn bị trừ điểm giấy phép lái xe 02 điểm;"

34.7.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm b, điểm c khoản 4 Điều này còn bị trừ điểm giấy phép lái xe 03 điểm;"

34.7.c:
  code_name: c
  full_name: "Thực hiện hành vi quy định tại điểm a khoản 5 Điều này còn bị trừ điểm giấy phép lái xe 04 điểm;"

34.7.d:
  code_name: d
  full_name: "Thực hiện hành vi quy định tại điểm b khoản 5 Điều này còn bị trừ điểm giấy phép lái xe 10 điểm."

35:
  code_name: 35
  full_name: Xử phạt, trừ điểm giấy phép lái xe đối với người đua xe trái phép, tổ chức đua xe, xúi giục, cổ vũ đua xe trái phép

35.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với hành vi vi phạm tụ tập để cổ vũ, giúp sức, xúi giục hành vi điều khiển xe chạy quá tốc độ quy định, lạng lách, đánh võng, đuổi nhau trên đường hoặc đua xe trái phép."

35.2:
  code_name: 2
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với cá nhân, từ 80.000.000 đồng đến 100.000.000 đồng đối với tổ chức thực hiện hành vi vi phạm tổ chức đua xe trái phép."

35.3:
  code_name: 3
  full_name: "Tịch thu phương tiện đối với người điều khiển phương tiện thực hiện một trong các hành vi vi phạm sau đây:"

35.3.a:
  code_name: a
  full_name: "Đua xe gắn máy, xe đạp máy, xe đạp trái phép trên đường giao thông;"

35.3.b:
  code_name: b
  full_name: "Đua xe ô tô, mô tô trái phép trên đường giao thông."

35.4:
  code_name: 4
  full_name: "Ngoài việc bị tịch thu phương tiện, người điều khiển phương tiện thực hiện hành vi quy định tại điểm b khoản 3 Điều này bị áp dụng hình thức xử phạt bổ sung tước quyền sử dụng giấy phép lái xe từ 22 tháng đến 24 tháng."

36:
  code_name: 36
  full_name: Xử phạt người điều khiển xe mô tô, xe gắn máy, xe thô sơ thực hiện hành vi vi phạm vận chuyển hành khách, hàng hóa

36.1:
  code_name: 1
  full_name: "Phạt tiền từ 300.000 đồng đến 400.000 đồng đối với người điều khiển phương tiện thực hiện một trong các hành vi vi phạm sau đây:"

36.1.a:
  code_name: a
  full_name: "Vận chuyển hàng hóa mà sắp xếp, chằng buộc hàng hóa không bảo đảm an toàn hoặc gây nguy hiểm cho người, phương tiện tham gia giao thông;"

36.1.b:
  code_name: b
  full_name: "Vận chuyển hàng hóa trên xe gây cản trở tầm nhìn của người lái xe hoặc che khuất đèn, biển số xe (đối với loại xe có đèn, biển số xe); để rơi hàng hóa xuống đường."

36.2:
  code_name: 2
  full_name: "Phạt tiền từ 400.000 đồng đến 600.000 đồng đối với một trong các hành vi vi phạm sau đây:"

36.2.a:
  code_name: a
  full_name: "Chở hành lý, hàng hóa vượt quá khối lượng cho phép của xe;"

36.2.b:
  code_name: b
  full_name: "Chở hành lý, hàng hóa vượt quá khổ giới hạn cho phép của xe;"

36.2.c:
  code_name: c
  full_name: "Vận chuyển hàng rời, vật liệu xây dựng, phế thải để rơi vãi xuống đường hoặc gây ra tiếng ồn, bụi bẩn;"

36.2.d:
  code_name: d
  full_name: "Vận chuyển hàng hóa vượt phía trước, phía sau xe mà không có báo hiệu màu đỏ tại điểm đầu và điểm cuối cùng của hàng hóa khi xe hoạt động ban ngày; vận chuyển hàng hóa vượt phía trước, phía sau xe mà không có đèn hoặc báo hiệu khi xe hoạt động vào ban đêm hoặc khi trời tối."

37:
  code_name: 37
  full_name: Xử phạt người điều khiển phương tiện giao thông cơ giới đường bộ gắn biển số nước ngoài

37.1:
  code_name: 1
  full_name: "Phạt tiền từ 1.000.000 đồng đến 2.000.000 đồng đối với người điều khiển phương tiện giao thông cơ giới đường bộ gắn biển số nước ngoài thực hiện một trong các hành vi vi phạm sau đây:"

37.1.a:
  code_name: a
  full_name: "Giấy tờ của phương tiện không có bản dịch sang tiếng Anh hoặc tiếng Việt theo quy định;"

37.1.b:
  code_name: b
  full_name: "Điều khiển xe chở hành khách không có danh sách hành khách theo quy định."

37.2:
  code_name: 2
  full_name: "Phạt tiền từ 2.000.000 đồng đến 4.000.000 đồng đối với hành vi điều khiển xe tham gia giao thông tại Việt Nam không có văn bản chấp thuận hoặc cấp phép của cơ quan có thẩm quyền cấp theo quy định (đối với loại xe tham gia giao thông tại Việt Nam có quy định phải được chấp thuận hoặc cấp phép)."

37.3:
  code_name: 3
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

37.3.a:
  code_name: a
  full_name: "Điều khiển phương tiện không gắn ký hiệu phân biệt quốc gia theo quy định;"

37.3.b:
  code_name: b
  full_name: "Điều khiển phương tiện không có giấy phép liên vận, giấy phép vận tải đường bộ quốc tế theo quy định hoặc có nhưng đã hết giá trị sử dụng;"

37.3.c:
  code_name: c
  full_name: "Vận chuyển hành khách hoặc hàng hóa không đúng với quy định tại các điều ước quốc tế mà Việt Nam đã ký kết, trừ các hành vi vi phạm quy định tại khoản 1, khoản 4, khoản 5, khoản 6 Điều này."

37.4:
  code_name: 4
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

37.4.a:
  code_name: a
  full_name: "Điều khiển phương tiện không gắn biển số tạm thời hoặc gắn biển số tạm thời không do cơ quan có thẩm quyền cấp (nếu có quy định phải gắn biển số tạm thời);"

37.4.b:
  code_name: b
  full_name: "Điều khiển xe ô tô có tay lái bên phải tham gia giao thông mà không đi theo đoàn, không có người, phương tiện hỗ trợ, hướng dẫn giao thông theo quy định."

37.5:
  code_name: 5
  full_name: "Phạt tiền từ 10.000.000 đồng đến 12.000.000 đồng đối với hành vi hoạt động quá phạm vi, tuyến đường, đoạn đường được phép hoạt động."

37.6:
  code_name: 6
  full_name: "Phạt tiền từ 30.000.000 đồng đến 35.000.000 đồng đối với hành vi lưu hành phương tiện trên lãnh thổ Việt Nam quá thời hạn quy định."

37.7:
  code_name: 7
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 2; điểm b, điểm c khoản 3; điểm a khoản 4; khoản 6 Điều này còn bị áp dụng biện pháp khắc phục hậu quả buộc tái xuất phương tiện khỏi Việt Nam."

38:
  code_name: 38
  full_name: Xử phạt người điều khiển phương tiện đăng ký hoạt động trong Khu kinh tế thương mại đặc biệt, Khu kinh tế cửa khẩu quốc tế

38.1:
  code_name: 1
  full_name: "Phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với người điều khiển xe mô tô, xe gắn máy, các loại xe tương tự xe mô tô và các loại xe tương tự xe gắn máy thực hiện một trong các hành vi vi phạm sau đây:"

38.1.a:
  code_name: a
  full_name: "Không có tờ khai phương tiện vận tải đường bộ tạm nhập, tái xuất theo quy định;"

38.1.b:
  code_name: b
  full_name: "Điều khiển xe không có phù hiệu kiểm soát theo quy định hoặc có nhưng đã hết giá trị sử dụng hoặc sử dụng phù hiệu không do cơ quan có thẩm quyền cấp."

38.2:
  code_name: 2
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với người điều khiển xe ô tô và các loại xe tương tự xe ô tô thực hiện một trong các hành vi vi phạm sau đây:"

38.2.a:
  code_name: a
  full_name: "Không có tờ khai phương tiện vận tải đường bộ tạm nhập, tái xuất theo quy định;"

38.2.b:
  code_name: b
  full_name: "Điều khiển xe không có phù hiệu kiểm soát theo quy định hoặc có nhưng đã hết giá trị sử dụng hoặc sử dụng phù hiệu không do cơ quan có thẩm quyền cấp."

38.3:
  code_name: 3
  full_name: "Tịch thu phương tiện đối với người điều khiển phương tiện tái phạm hành vi quy định tại khoản 1, khoản 2 Điều này."

38.4:
  code_name: 4
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại khoản 1, khoản 2 Điều này còn bị áp dụng biện pháp khắc phục hậu quả buộc đưa phương tiện quay trở lại Khu kinh tế thương mại đặc biệt, Khu kinh tế cửa khẩu quốc tế."

38.5:
  code_name: 5
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, người điều khiển phương tiện thực hiện hành vi vi phạm quy định tại điểm b khoản 1, điểm b khoản 2 Điều này bị thu hồi phù hiệu đã hết giá trị sử dụng hoặc phù hiệu không do cơ quan có thẩm quyền cấp."

39:
  code_name: 39
  full_name: Xử phạt các hành vi vi phạm quy định về đào tạo, sát hạch lái xe

39.1:
  code_name: 1
  full_name: "Phạt tiền từ 2.000.000 đồng đến 3.000.000 đồng đối với giáo viên dạy lái xe thực hiện một trong các hành vi vi phạm sau đây:"

39.1.a:
  code_name: a
  full_name: "Giáo viên dạy thực hành để học viên không có phù hiệu “Học viên tập lái xe” lái xe tập lái hoặc có phù hiệu nhưng không đeo khi lái xe tập lái;"

39.1.b:
  code_name: b
  full_name: "Giáo viên dạy thực hành chở người, hàng trên xe tập lái trái quy định;"

39.1.c:
  code_name: c
  full_name: "Giáo viên dạy thực hành chạy không đúng tuyến đường trong giấy phép xe tập lái; không ngồi bên cạnh để bảo trợ tay lái cho học viên thực hành lái xe (kể cả trong sân tập lái và ngoài đường giao thông công cộng);"

39.1.d:
  code_name: d
  full_name: "Không đeo phù hiệu “Giáo viên dạy lái xe” khi giảng dạy;"

39.1.đ:
  code_name: đ
  full_name: "Không có giáo án của môn học được phân công giảng dạy theo quy định hoặc có giáo án nhưng không phù hợp với môn được phân công giảng dạy;"

39.1.e:
  code_name: e
  full_name: "Giáo viên dạy thực hành không mang theo giấy phép xe tập lái hoặc mang theo giấy phép xe tập lái đã hết giá trị sử dụng."

39.2:
  code_name: 2
  full_name: "Phạt tiền từ 3.000.000 đồng đến 5.000.000 đồng đối với cơ sở đào tạo lái xe thực hiện một trong các hành vi vi phạm sau đây:"

39.2.a:
  code_name: a
  full_name: "Sử dụng xe tập lái không có mui che mưa, nắng; không có ghế ngồi gắn chắc chắn trên thùng xe cho người học theo quy định;"

39.2.b:
  code_name: b
  full_name: "Không thực hiện việc ký hợp đồng đào tạo, thanh lý hợp đồng đào tạo với người học lái xe theo quy định; có ký hợp đồng đào tạo, thanh lý hợp đồng đào tạo nhưng không do người học lái xe trực tiếp ký;"

39.2.c:
  code_name: c
  full_name: "Không công khai quy chế tuyển sinh, quản lý đào tạo và mức thu học phí theo quy định;"

39.3:
  code_name: 3
  full_name: "Phạt tiền từ 5.000.000 đồng đến 10.000.000 đồng đối với một trong các hành vi vi phạm sau đây:"

39.3.a:
  code_name: a
  full_name: "Cơ sở đào tạo lái xe không bố trí giáo viên dạy thực hành ngồi bên cạnh để bảo trợ tay lái cho học viên thực hành lái xe; bố trí giáo viên không đủ tiêu chuẩn để giảng dạy;"

39.3.b:
  code_name: b
  full_name: "Cơ sở đào tạo lái xe sử dụng xe tập lái không có giấy phép xe tập lái hoặc có nhưng hết hạn, không gắn biển xe “Tập lái” trên xe theo quy định, không ghi tên cơ sở đào tạo, số điện thoại ở mặt ngoài hai bên cánh cửa hoặc hai bên thành xe theo quy định;"

39.3.c:
  code_name: c
  full_name: "Cơ sở đào tạo lái xe sử dụng xe tập lái không trang bị thêm bộ phận hãm phụ hoặc có nhưng không có tác dụng;"

39.3.d:
  code_name: d
  full_name: "Cơ sở đào tạo lái xe tuyển sinh học viên không đủ điều kiện trình độ văn hóa, thời gian lái xe an toàn tương ứng với từng hạng đào tạo; tuyển sinh học viên không đủ hồ sơ theo quy định;"

39.3.đ:
  code_name: đ
  full_name: "Cơ sở đào tạo lái xe không có đủ số lượng giáo viên dạy thực hành lái xe các hạng để đáp ứng với kế hoạch sử dụng các xe tập lái dùng để đào tạo;"

39.3.e:
  code_name: e
  full_name: "Cơ sở đào tạo lái xe không lưu trữ hoặc lưu trữ không đầy đủ hồ sơ theo quy định của 01 khóa đào tạo;"

39.3.g:
  code_name: g
  full_name: "Trung tâm sát hạch lái xe không duy trì đủ các điều kiện quy định trong Quy chuẩn kỹ thuật quốc gia về Trung tâm sát hạch lái xe cơ giới đường bộ, trừ các hành vi vi phạm quy định tại khoản 4, khoản 5, khoản 7 Điều này;"

39.3.h:
  code_name: h
  full_name: "Trung tâm sát hạch lái xe không lưu trữ hoặc lưu trữ không đầy đủ hồ sơ theo quy định của 01 kỳ sát hạch lái xe;"

39.3.i:
  code_name: i
  full_name: "Cá nhân sử dụng các giấy tờ, tài liệu không đúng sự thật để được học, kiểm tra, sát hạch cấp mới, cấp lại giấy phép lái xe, chứng chỉ bồi dưỡng kiến thức pháp luật về giao thông đường bộ mà chưa đến mức bị truy cứu trách nhiệm hình sự;"

39.3.k:
  code_name: k
  full_name: "Người dự sát hạch mang điện thoại di động, thiết bị viễn thông liên lạc bằng hình ảnh, âm thanh vào phòng sát hạch lý thuyết, mô phỏng các tình huống giao thông, lên xe sát hạch hoặc có hành vi gian dối khác làm sai lệch kết quả sát hạch."

39.4:
  code_name: 4
  full_name: "Phạt tiền từ 10.000.000 đồng đến 20.000.000 đồng đối với cơ sở đào tạo lái xe, trung tâm sát hạch lái xe thực hiện một trong các hành vi vi phạm sau đây:"

39.4.a:
  code_name: a
  full_name: "Cơ sở đào tạo lái xe tổ chức tuyển sinh, đào tạo vượt quá lưu lượng quy định trong giấy phép đào tạo lái xe;"

39.4.b:
  code_name: b
  full_name: "Cơ sở đào tạo lái xe tổ chức đào tạo lái xe ngoài địa điểm được ghi trong giấy phép đào tạo lái xe:"

39.4.c:
  code_name: c
  full_name: "Cơ sở đào tạo lái xe không lưu trữ hoặc lưu trữ không đầy đủ hồ sơ theo quy định của 02 khóa đào tạo trở lên;"

39.4.d:
  code_name: d
  full_name: "Cơ sở đào tạo lái xe bố trí học viên tập lái trên xe tập lái vượt quá số lượng quy định;"

39.4.đ:
  code_name: đ
  full_name: "Cơ sở đào tạo lái xe không có đủ hệ thống phòng học; phòng học không đủ trang thiết bị, mô hình học cụ;"

39.4.e:
  code_name: e
  full_name: "Cơ sở đào tạo lái xe không có đủ sân tập lái hoặc sân tập lái không đủ điều kiện theo quy định;"

39.4.g:
  code_name: g
  full_name: "Cơ sở đào tạo lái xe không có đủ số lượng xe tập lái các hạng để đáp ứng với lưu lượng đào tạo thực tế tại các thời điểm hoặc sử dụng xe tập lái không đúng hạng để dạy thực hành lái xe;"

39.4.h:
  code_name: h
  full_name: "Cơ sở đào tạo lái xe không có đủ thiết bị giám sát thời gian học lý thuyết, thời gian, quãng đường học thực hành lái xe của học viên hoặc có các thiết bị đó nhưng không hoạt động theo quy định;"

39.4.i:
  code_name: i
  full_name: "Trung tâm sát hạch lái xe không có hệ thống âm thanh thông báo công khai lỗi vi phạm của thí sinh sát hạch lái xe trong hình theo quy định hoặc có hệ thống âm thanh thông báo nhưng không hoạt động theo quy định trong quá trình sát hạch lái xe trong hình;"

39.4.k:
  code_name: k
  full_name: "Trung tâm sát hạch lái xe không có đủ màn hình để công khai hình ảnh giám sát phòng sát hạch lý thuyết, mô phỏng các tình huống giao thông, kết quả sát hạch lái xe theo quy định hoặc có đủ màn hình nhưng không hoạt động theo quy định trong quá trình sát hạch."

39.5:
  code_name: 5
  full_name: "Phạt tiền từ 20.000.000 đồng đến 30.000.000 đồng đối với cơ sở đào tạo lái xe, trung tâm sát hạch lái xe thực hiện một trong các hành vi vi phạm sau đây:"

39.5.a:
  code_name: a
  full_name: "Cơ sở đào tạo lái xe tổ chức tuyển sinh, đào tạo không đúng hạng giấy phép lái xe được phép đào tạo;"

39.5.b:
  code_name: b
  full_name: "Cơ sở đào tạo lái xe đào tạo không đúng nội dung, chương trình, giáo trình theo quy định;"

39.5.c:
  code_name: c
  full_name: "Cơ sở đào tạo lái xe xét hoàn thành khóa đào tạo hoặc cấp chứng chỉ sơ cấp hoặc cấp chứng chỉ đào tạo cho học viên sai quy định;"

39.5.d:
  code_name: d
  full_name: "Cơ sở đào tạo lái xe sử dụng biện pháp kỹ thuật, trang thiết bị ngoại vi, các biện pháp khác để can thiệp vào quá trình hoạt động làm sai lệch dữ liệu của thiết bị giám sát thời gian học lý thuyết, thời gian, quãng đường học thực hành lái xe;"

39.5.đ:
  code_name: đ
  full_name: "Trung tâm sát hạch lái xe không lắp đủ camera giám sát phòng sát hạch lý thuyết, mô phỏng các tình huống giao thông, sân sát hạch theo quy định hoặc có lắp camera giám sát nhưng không hoạt động theo quy định;"

39.5.e:
  code_name: e
  full_name: "Trung tâm sát hạch lái xe có trên 50% số xe sát hạch lái xe trong tỉnh được cấp phép không bảo đảm điều, kiện để sát hạch theo quy định;"

39.5.g:
  code_name: g
  full_name: "Trung tâm sát hạch lái xe có trên 50% số xe sát hạch lái xe trên đường được cấp phép không bảo đảm điều kiện để sát hạch theo quy định;"

39.5.h:
  code_name: h
  full_name: "Trung tâm sát hạch lái xe có trên 50% số máy tính sát hạch lý thuyết được cấp phép không bảo đảm điều kiện để sát hạch theo quy định;"

39.5.i:
  code_name: i
  full_name: "Trung tâm sát hạch lái xe tự ý di chuyển vị trí các phòng chức năng; thay đổi hình các bài sát hạch mà chưa được chấp thuận của cơ quan quản lý nhà nước có thẩm quyền;"

39.5.k:
  code_name: k
  full_name: "Trung tâm sát hạch lái xe không lưu trữ hoặc lưu trữ không đầy đủ hồ sơ theo quy định của 02 kỳ sát hạch lái xe trở lên."

39.6:
  code_name: 6
  full_name: "Phạt tiền từ 15.000.000 đồng đến 20.000.000 đồng đối với cá nhân, từ 30.000.000 đồng đến 40.000.000 đồng đối với tổ chức thực hiện hành vi tổ chức tuyển sinh, đào tạo lái xe mà không có giấy phép đào tạo lái xe."

39.7:
  code_name: 7
  full_name: "Phạt tiền từ 40.000.000 đồng đến 50.000.000 đồng đối với trung tâm sát hạch lái xe thực hiện một trong các hành vi vi phạm sau đây:"

39.7.a:
  code_name: a
  full_name: "Tự ý thay đổi hoặc sử dụng phần mềm sát hạch, thiết bị chấm điểm, xe sát hạch khi chưa được sự chấp thuận của cơ quan quản lý nhà nước có thẩm quyền;"

39.7.b:
  code_name: b
  full_name: "Sử dụng máy tính trong phòng sát hạch lý thuyết kết nối với đường truyền ra ngoài phòng thi trái quy định;"

39.7.c:
  code_name: c
  full_name: "Cố tình để phương tiện, trang thiết bị chấm điểm hoạt động không chính xác trong kỳ sát hạch; để các dấu hiệu, ký hiệu trái quy định trên sân sát hạch, xe sát hạch trong kỳ sát hạch."

39.8:
  code_name: 8
  full_name: "Giáo viên dạy thực hành để học viên thực hành lái xe thực hiện một trong các hành vi vi phạm quy định tại Điều 6 của Nghị định này, bị xử phạt theo quy định đối với hành vi vi phạm đó."

39.9:
  code_name: 9
  full_name: "Ngoài việc bị phạt tiền, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng các hình thức xử phạt bổ sung sau đây:"

39.9.a:
  code_name: a
  full_name: "Cơ sở đào tạo lái xe thực hiện hành vi quy định tại điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e khoản 3; điểm a, điểm b, điểm d, điểm đ, điểm e, điểm g khoản 4 Điều này bị đình chỉ tuyển sinh từ 01 tháng đến 03 tháng;"

39.9.b:
  code_name: b
  full_name: "Cơ sở đào tạo lái xe thực hiện hành vi quy định tại điểm c khoản 4; điểm a, điểm b, điểm c, điểm d khoản 5 Điều này bị đình chỉ tuyển sinh từ 02 tháng đến 04 tháng;"

39.9.c:
  code_name: c
  full_name: "Trung tâm sát hạch lái xe thực hiện hành vi quy định tại điểm h khoản 3; điểm i, điểm k khoản 4; điểm đ, điểm e, điểm g, điểm h, điểm i khoản 5 Điều này bị tước quyền sử dụng giấy phép sát hạch từ 01 tháng đến 03 tháng;"

39.9.đ:
  code_name: đ
  full_name: "Trung tâm sát hạch lái xe thực hiện hành vi quy định tại điểm k khoản 5, khoản 7 Điều này bị tước quyền sử dụng giấy phép sát hạch từ 02 tháng đến 04 tháng."

"39.10":
  code_name: 10
  full_name: "Ngoài việc bị áp dụng hình thức xử phạt, cá nhân thực hiện hành vi vi phạm quy định tại điểm i khoản 3 Điều này còn bị áp dụng biện pháp khắc phục hậu quả thu hồi giấy tờ, tài liệu giả mạo."

40:
  code_name: 40
  full_name: Xử phạt các hành vi vi phạm quy định về hoạt động đăng kiểm xe cơ giới, xe máy chuyên dùng, phụ tùng xe cơ giới

40.1:
  code_name: 1
  full_name: "Phạt tiền từ 8.000.000 đồng đến 10.000.000 đồng đối với cá nhân thực hiện một trong các hành vi vi phạm sau đây:"

40.1.a:
  code_name: a
  full_name: "Không tuân thủ đúng quy định tại các quy trình, quy chuẩn kỹ thuật có liên quan trong chứng nhận, kiểm định xe cơ giới, xe máy chuyên dùng, phụ tùng xe cơ giới;"

40.1.b:
  code_name: b
  full_name: "Không thực hiện đúng chức trách, nhiệm vụ được phân công trong chứng nhận, kiểm định xe cơ giới, xe máy chuyên dùng, phụ tùng xe cơ giới;"

40.1.c:
  code_name: c
  full_name: "Đưa ra các yêu cầu trái quy định về trình tự, thủ tục đăng kiểm đối với cá nhân, tổ chức."

40.2:
  code_name: 2
  full_name: "Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với cơ sở đăng kiểm thực hiện một trong các hành vi vi phạm sau đây:"

40.2.a:
  code_name: a
  full_name: "Không duy trì việc bảo đảm về điều kiện, yêu cầu theo quy định tại Nghị định của Chính phủ quy định về điều kiện kinh doanh dịch vụ kiểm định xe cơ giới; tổ chức, hoạt động của cơ sở đăng kiểm; niên hạn sử dụng của xe cơ giới;"

40.2.b:
  code_name: b
  full_name: "Có từ 02 lượt đăng kiểm viên trở lên bị xử phạt theo quy định tại khoản 1 Điều này trong thời hạn 12 tháng tính từ lần vi phạm đầu tiên;"

40.2.c:
  code_name: c
  full_name: "Phân công người không đủ điều kiện thực hiện nhiệm vụ của đăng kiểm viên, nhân viên nghiệp vụ;"

40.2.d:
  code_name: d
  full_name: "Cấp chứng nhận cải tạo cho xe cơ giới, xe máy chuyên dùng không đúng quy định;"

40.2.đ:
  code_name: đ
  full_name: "Thực hiện kiểm định đối với phương tiện thuộc trường hợp bị từ chối kiểm định theo quy định;"

40.2.e:
  code_name: e
  full_name: "Lưu trữ hồ sơ, tài liệu, dữ liệu kiểm định, cải tạo xe không đúng quy định;"

40.2.g:
  code_name: g
  full_name: "Không thực hiện việc cập nhật hồ sơ phương tiện cho xe cơ giới, xe máy chuyên dùng theo quy định."

40.3:
  code_name: 3
  full_name: "Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với cơ sở thử nghiệm, chứng nhận xe cơ giới, xe máy chuyên dùng, phụ tùng xe cơ giới trong sản xuất, lắp ráp và nhập khẩu thực hiện một trong các hành vi vi phạm sau đây:"

40.3.a:
  code_name: a
  full_name: "Không thực hiện niêm yết công khai các trình tự, thủ tục thử nghiệm, chứng nhận theo quy định;"

40.3.b:
  code_name: b
  full_name: "Thực hiện việc thử nghiệm, chứng nhận không đúng quy định;"

40.3.c:
  code_name: c
  full_name: "Phân công người không đủ điều kiện thực hiện việc thử nghiệm, chứng nhận;"

40.3.d:
  code_name: d
  full_name: "Sử dụng thiết bị, dụng cụ không đảm bảo theo quy định của pháp luật về đo lường để kiểm tra, thử nghiệm;"

40.3.đ:
  code_name: đ
  full_name: "Có từ 02 lượt đăng kiểm viên trở lên bị xử phạt theo quy định tại khoản 1 Điều này trong thời hạn 12 tháng tính từ lần bị xử phạt đầu tiên;"

40.3.e:
  code_name: c
  full_name: "Lưu trữ hồ sơ, tài liệu, dữ liệu chứng nhận không đúng quy định."

40.4:
  code_name: 4
  full_name: "Phạt tiền từ 16.000.000 đồng đến 20.000.000 đồng đối với cơ sở đăng kiểm thực hiện một trong các hành vi vi phạm sau đây:"

40.4.a:
  code_name: a
  full_name: "Kiểm định, cấp giấy chứng nhận kiểm định cho xe cơ giới, xe máy chuyên dùng, kiểm định khí thải xe mô tô, xe gắn máy không đúng quy định, tiêu chuẩn, quy chuẩn kỹ thuật;"

40.4.b:
  code_name: b
  full_name: "Đưa ra các yêu cầu trái quy định về trình tự, thủ tục đăng kiểm đối với cá nhân, tổ chức;"

40.4.c:
  code_name: c
  full_name: "Từ chối cung cấp dịch vụ kiểm định không đúng quy định của pháp luật."

40.5:
  code_name: 5
  full_name: "Phạt tiền từ 16.000.000 đồng đến 20.000.000 đồng đối với cơ sở sản xuất, lắp ráp, cơ sở nhập khẩu, cơ sở bảo hành, bảo dưỡng hoặc tổ chức, cá nhân được ủy quyền thực hiện một trong các hành vi vi phạm sau đây:"

40.5.a:
  code_name: a
  full_name: "Sử dụng, cung cấp hồ sơ, tài liệu giả để thực hiện việc kiểm tra, chứng nhận, thử nghiệm nhưng chưa đến mức bị truy cứu trách nhiệm hình sự;"

40.5.b:
  code_name: b
  full_name: "Sử dụng thiết bị, dụng cụ không đảm bảo theo quy định của pháp luật về đo lường để kiểm tra chất lượng xuất xưởng xe cơ giới, xe máy chuyên dùng, phụ tùng xe cơ giới."

40.6:
  code_name: 6
  full_name: "Ngoài việc bị phạt tiền, cá nhân, tổ chức thực hiện hành vi vi phạm còn bị áp dụng hình thức xử phạt bổ sung sau đây:"

40.6.a:
  code_name: a
  full_name: "Thực hiện hành vi quy định tại khoản 1 Điều này bị tước quyền sử dụng chứng chỉ đăng kiểm viên từ 01 tháng đến 03 tháng;"

40.6.b:
  code_name: b
  full_name: "Thực hiện hành vi quy định tại điểm a, điểm b, điểm c, điểm d, điểm g khoản 2; khoản 4 Điều này bị tước quyền sử dụng giấy chứng nhận đủ điều kiện hoạt động kiểm định xe cơ giới từ 01 tháng đến 03 tháng."

III:
  code_name: III
  full_name: THẨM QUYỀN, THỦ TỤC XỬ PHẠT, TRỪ ĐIỂM, PHỤC HỒI ĐIỂM GIẤY PHÉP LÁI XE

III.1:
  code_name: c
  full_name: "THẨM QUYỀN XỬ PHẠT"

41:
  code_name: 41
  full_name: Phân định thẩm quyền xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ

41.1:
  code_name: 1
  full_name: "Chủ tịch Ủy ban nhân dân các cấp có thẩm quyền xử phạt đối với các hành vi vi phạm quy định tại Nghị định này trong phạm vi quản lý của địa phương mình."

41.2:
  code_name: 2
  full_name: "Cảnh sát giao thông trong phạm vi chức năng, nhiệm vụ được giao có thẩm quyền xử phạt đối với các hành vi vi phạm quy định tại các điểm, khoản, điều của Nghị định này như sau:"

41.2.a:
  code_name: a
  full_name: "Điều 6, Điều 7, Điều 8, Điều 9, Điều 10, Điều 11, Điều 12, Điều 13, Điều 14, Điều 15, Điều 16, Điều 17, Điều 18, Điều 19, Điều 20, Điều 21, Điều 22, Điều 23, Điều 24, Điều 25, Điều 26, Điều 27, Điều 28, Điều 29, Điều 30, Điều 31, Điều 32, Điều 33, Điều 34, Điều 35, Điều 36;"

41.2.b:
  code_name: b
  full_name: "Khoản 1, điểm a khoản 3, điểm b khoản 4, khoản 5 Điều 37;"

41.2.c:
  code_name: c
  full_name: "Điều 38;"

41.2.d:
  code_name: d
  full_name: "Điểm a, điểm b, điểm c, điểm d, điểm e khoản 1; điểm a khoản 2; điểm a, điểm b, điểm c khoản 3; điểm d khoản 4; khoản 8 Điều 39."

41.3:
  code_name: 3
  full_name: "Cảnh sát trật tự, Cảnh sát phản ứng nhanh, Cảnh sát cơ động, Cảnh sát quản lý hành chính về trật tự xã hội trong phạm vi chức năng, nhiệm vụ được giao có liên quan đến trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ có thẩm quyền xử phạt đối với các hành vi vi phạm quy định tại các điểm, khoản, điều của Nghị định này như sau:"

41.3.a:
  code_name: a
  full_name: "Điểm c, điểm đ khoản 1; điểm d, điểm đ khoản 2; điểm b, điểm d, điểm đ, điểm e, điểm g, điểm o khoản 3; điểm b, điểm c, điểm đ, điểm i, điểm k khoản 4; điểm i, điểm k khoản 5; điểm b, điểm c, điểm d khoản 6; khoản 9; điểm a, điểm b, điểm c, điểm d khoản 11; khoản 12 Điều 6;"

41.3.b:
  code_name: b
  full_name: "Điểm e, điểm g, điểm i, điểm k khoản 1; điểm a, điểm c, điểm d, điểm e, điểm g, điểm h, điểm i, điểm k khoản 2; điểm b, điểm c, điểm d, điểm e, điểm g, điểm k khoản 3; điểm b, điểm d, điểm đ khoản 4; điểm b, điểm c khoản 5; điểm a, điểm b, điểm c khoản 6; điểm a, điểm c, điểm d khoản 7; điểm b khoản 8; điểm a, điểm b, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm i, điểm k khoản 9; khoản 11 Điều 7;"

41.3.c:
  code_name: c
  full_name: "Khoản 2; điểm b, điểm c, điểm đ khoản 3; điểm b, điểm c, điểm d, điểm đ, điểm e khoản 4; điểm a, điểm b, điểm c khoản 5; điểm c, điểm d, điểm g khoản 6; khoản 7; điểm a, điểm b, điểm c, điểm d khoản 9 Điều 8;"

41.3.d:
  code_name: d
  full_name: "Khoản 1, khoản 2, khoản 3, khoản 4 Điều 9;"

41.3.đ:
  code_name: đ
  full_name: "Khoản 1; điểm b, điểm c khoản 2 Điều 10;"

41.3.e:
  code_name: e
  full_name: "Khoản 1, khoản 2 Điều 11;"

41.3.g:
  code_name: g
  full_name: "Khoản 1; khoản 2; khoản 3; khoản 5; điểm c, điểm d khoản 6; khoản 7; khoản 9; khoản 10; điểm a, điểm c khoản 11; khoản 12; khoản 14 Điều 12;"

41.3.h:
  code_name: h
  full_name: "Điều 15, Điều 17;"

41.3.i:
  code_name: i
  full_name: "Điểm b khoản 3; điểm a, điểm c, điểm d, điểm g khoản 5; điểm a, điểm b, điểm c khoản 6 Điều 20;"

41.3.k:
  code_name: k
  full_name: "Khoản 2, khoản 3, khoản 4, khoản 5 Điều 23;"

41.3.l:
  code_name: l
  full_name: "Điều 24; Điều 25;"

41.3.m:
  code_name: m
  full_name: "Khoản 1, khoản 3 Điều 28;"

41.3.n:
  code_name: n
  full_name: "Điều 31; Điều 33; Điều 35; Điều 36."

41.4:
  code_name: 4
  full_name: "Trưởng Công an cấp xã, Trưởng đồn Công an, Trưởng trạm Công an cửa khẩu, khu chế xuất trong phạm vi chức năng, nhiệm vụ được giao có liên quan đến trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ có thẩm quyền xử phạt đối với các hành vi vi phạm quy định tại các điểm, khoản, điều của Nghị định này như sau:"

41.4.a:
  code_name: a
  full_name: "Điểm đ khoản 1; điểm d, điểm đ khoản 2; điểm b, điểm d, điểm đ, điểm e, điểm g khoản 3 Điều 6;"

41.4.b:
  code_name: b
  full_name: "Điểm d, điểm e, điểm g, điểm i khoản 1; điểm a, điểm d, điểm e, điểm g, điểm h, điểm i, điểm k khoản 2; điểm b, điểm c, điểm e, điểm g, điểm k khoản 3; điểm b, điểm d, điểm đ khoản 4 Điều 7;"

41.4.c:
  code_name: c
  full_name: "Khoản 2; điểm b, điểm c khoản 3; điểm c, điểm d, điểm đ, điểm e khoản 4 Điều 8;"

41.4.d:
  code_name: d
  full_name: "Điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm i, điểm k, điểm l, điểm m, điểm n, điểm o khoản 1; khoản 2; điểm a, điểm b, điểm c khoản 3; điểm d, điểm đ khoản 4 Điều 9;"

41.4.đ:
  code_name: đ
  full_name: "Khoản 1; điểm b, điểm c khoản 2 Điều 10;"

41.4.e:
  code_name: e
  full_name: "Khoản 1, khoản 2 Điều 11;"

41.4.g:
  code_name: g
  full_name: "Khoản 1; khoản 2; khoản 3; khoản 5; điểm c, điểm d khoản 6 Điều 12;"

41.4.h:
  code_name: h
  full_name: "Điều 15;"

41.4.i:
  code_name: i
  full_name: "Khoản 1 Điều 17;"

41.4.k:
  code_name: k
  full_name: "Điểm b khoản 3 Điều 20;"

41.4.l:
  code_name: l
  full_name: "Khoản 1, khoản 2 Điều 33;"

41.4.m:
  code_name: m
  full_name: "Khoản 1 Điều 35."

41.5:
  code_name: 5
  full_name: "Thanh tra đường bộ, người được giao thực hiện nhiệm vụ thanh tra chuyên ngành đường bộ trong phạm vi chức năng, nhiệm vụ được giao có thẩm quyền xử phạt tại các điểm, khoản, điều của Nghị định này như sau:"

41.5.a:
  code_name: a
  full_name: "Khoản 1; điểm a, điểm b, điểm c, điểm d, điểm e khoản 2; khoản 3; khoản 4; khoản 5; điểm a khoản 6; điểm a, điểm d, điểm g, điểm h khoản 7; điểm a, điểm b khoản 8 Điều 26; điểm a khoản 2; điểm i, điểm l khoản 7; điểm b khoản 8; điểm a khoản 9; điểm c khoản 16; điểm a, điểm b khoản 17 Điều 32 khi thực hiện công tác thanh tra, kiểm tra tại đơn vị vận tải, bến xe, bãi đỗ xe, trạm dừng nghỉ, đơn vị thực hiện dịch vụ hỗ trợ vận tải;"

41.5.b:
  code_name: b
  full_name: "Điều 39, Điều 40."

42:
  code_name: 42
  full_name: Thẩm quyền xử phạt của Chủ tịch Ủy ban nhân dân các cấp

42.1:
  code_name: 1
  full_name: "Chủ tịch Ủy ban nhân dân cấp xã có quyền:"

42.1.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

42.1.b:
  code_name: b
  full_name: "Phạt tiền đến 5.000.000 đồng;"

42.1.c:
  code_name: c
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 10.000.000 đồng;"

42.1.d:
  code_name: d
  full_name: "Áp dụng biện pháp khắc phục hậu quả quy định tại các điểm a, điểm b khoản 3 Điều 3 của Nghị định này."

42.2:
  code_name: 2
  full_name: "Chủ tịch Ủy ban nhân dân cấp huyện có quyền:"

42.2.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

42.2.b:
  code_name: b
  full_name: "Phạt tiền đến 37.500.000 đồng;"

42.2.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

42.2.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính;"

42.2.đ:
  code_name: đ
  full_name: "Áp dụng biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 (trừ điểm c khoản 3 Điều 3) của Nghị định này."

42.3:
  code_name: 3
  full_name: "Chủ tịch Ủy ban nhân dân cấp tỉnh có quyền:"

42.3.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

42.3.b:
  code_name: b
  full_name: "Phạt tiền đến 75.000.000 đồng;"

42.3.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

42.3.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính;"

42.3.đ:
  code_name: đ
  full_name: "Áp dụng biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 của Nghị định này."

43:
  code_name: 43
  full_name: Thẩm quyền xử phạt của Công an nhân dân

43.1:
  code_name: 1
  full_name: "Chiến sĩ Công an nhân dân đang thi hành công vụ có quyền:"

43.1.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.1.b:
  code_name: b
  full_name: "Phạt tiền đến 500.000 đồng."

43.2:
  code_name: 2
  full_name: "Thủ trưởng đơn vị Cảnh sát cơ động cấp đại đội, Trưởng trạm, Đội trưởng của người quy định tại khoản 1 Điều này có quyền:"

43.2.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.2.b:
  code_name: b
  full_name: "Phạt tiền đến 1.500.000 đồng."

43.3:
  code_name: 3
  full_name: "Trưởng Công an cấp xã, Trưởng đồn Công an, Trưởng trạm Công an cửa khẩu, khu chế xuất, Tiểu đoàn trưởng Tiểu đoàn Cảnh sát cơ động có quyền:"

43.3.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.3.b:
  code_name: b
  full_name: "Phạt tiền đến 2.500.000 đồng;"

43.3.c:
  code_name: c
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 5.000.000 đồng;"

43.3.d:
  code_name: d
  full_name: "Áp dụng biện pháp khắc phục hậu quả quy định tại điểm a, điểm b khoản 3 Điều 3 của Nghị định này."

43.4:
  code_name: 4
  full_name: "Trưởng Công an cấp huyện; Trưởng phòng nghiệp vụ thuộc Cục Cảnh sát giao thông; Trưởng phòng nghiệp vụ thuộc Cục Cảnh sát quản lý hành chính về trật tự xã hội; Trưởng phòng Công an cấp tỉnh bao gồm: Trưởng phòng Cảnh sát quản lý hành chính về trật tự xã hội, Trưởng phòng Cảnh sát giao thông, Trưởng phòng Cảnh sát cơ động, Trung đoàn trưởng Trung đoàn Cảnh sát cơ động có quyền:"

43.4.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.4.b:
  code_name: b
  full_name: "Phạt tiền đến 15.000.000 đồng;"

43.4.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

43.4.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 30.000.000 đồng;"

43.4.đ:
  code_name: đ
  full_name: "Áp dụng biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 (trừ điểm c, điểm d khoản 3 Điều 3) của Nghị định này."

43.5:
  code_name: 5
  full_name: "Giám đốc Công an cấp tỉnh có quyền:"

43.5.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.5.b:
  code_name: b
  full_name: "Phạt tiền đến 37.500.000 đồng;"

43.5.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

43.5.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính;"

43.5.đ:
  code_name: đ
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 (trừ điểm c khoản 3 Điều 3) của Nghị định này."

43.6:
  code_name: 6
  full_name: "Cục trưởng Cục Cảnh sát giao thông, Cục trưởng Cục Cảnh sát quản lý hành chính về trật tự xã hội, Tư lệnh Cảnh sát cơ động có quyền:"

43.6.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

43.6.b:
  code_name: b
  full_name: "Phạt tiền đến 75.000.000 đồng;"

43.6.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

43.6.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính;"

43.6.đ:
  code_name: đ
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 (trừ điểm c khoản 3 Điều 3) của Nghị định này."

44:
  code_name: 44
  full_name: Thẩm quyền xử phạt của Thanh tra chuyên ngành

44.1:
  code_name: 1
  full_name: "Thanh tra viên, người được giao thực hiện nhiệm vụ thanh tra chuyên ngành đang thi hành công vụ có quyền:"

44.1.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

44.1.b:
  code_name: b
  full_name: "Phạt tiền đến 500.000 đồng;"

44.1.c:
  code_name: c
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 1.000.000 đồng;"

44.1.d:
  code_name: d
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại điểm a, điểm b khoản 3 Điều 3 của Nghị định này."

44.2:
  code_name: 2
  full_name: "Chánh Thanh tra Sở Giao thông vận tải có quyền:"

44.2.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

44.2.b:
  code_name: b
  full_name: "Phạt tiền đến 37.500.000 đồng;"

44.2.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

44.2.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 75.000.000 đồng;"

44.2.đ:
  code_name: đ
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 của Nghị định này."

44.3:
  code_name: 3
  full_name: "Chánh Thanh tra tỉnh, thành phố trực thuộc trung ương (trong trường hợp không thành lập Thanh tra Sở Giao thông vận tải) có quyền:"

44.3.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

44.3.b:
  code_name: b
  full_name: "Phạt tiền đến 52.500.000 đồng;"

44.3.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

44.3.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính có giá trị không vượt quá 105.000.000 đồng;"

44.3.đ:
  code_name: đ
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 của Nghị định này."

44.4:
  code_name: 4
  full_name: "Chánh Thanh tra Bộ Giao thông vận tải, Cục trưởng Cục Đường bộ Việt Nam, Cục trưởng Cục Đăng kiểm Việt Nam có quyền:"

44.4.a:
  code_name: a
  full_name: "Phạt cảnh cáo;"

44.4.b:
  code_name: b
  full_name: "Phạt tiền đến 75.000.000 đồng;"

44.4.c:
  code_name: c
  full_name: "Tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn;"

44.4.d:
  code_name: d
  full_name: "Tịch thu tang vật, phương tiện được sử dụng để vi phạm hành chính;"

44.4.đ:
  code_name: đ
  full_name: "Áp dụng các biện pháp khắc phục hậu quả quy định tại khoản 3 Điều 3 của Nghị định này."

45:
  code_name: 45
  full_name: Nguyên tắc xác định thẩm quyền xử phạt vi phạm hành chính và áp dụng biện pháp khắc phục hậu quả

45.1:
  code_name: 1
  full_name: "Nguyên tắc xác định thẩm quyền xử phạt vi phạm hành chính và áp dụng biện pháp khắc phục hậu quả về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ thực hiện theo quy định tại Điều 52 của Luật Xử lý vi phạm hành chính."

45.2:
  code_name: 2
  full_name: "Thẩm quyền xử phạt vi phạm hành chính của các chức danh quy định tại Điều 42, Điều 43 và Điều 44 của Nghị định này là thẩm quyền áp dụng đối với một hành vi vi phạm hành chính của cá nhân; trong trường hợp phạt tiền, thẩm quyền xử phạt tổ chức gấp 02 lần thẩm quyền xử phạt cá nhân."

45.3:
  code_name: 3
  full_name: "Trường hợp cá nhân, tổ chức thực hiện hành vi vi phạm quy định tại khoản 2, khoản 4 Điều 20; khoản 5, khoản 6 Điều 32 của Nghị định này, việc xác định mức tối thiểu và mức tối đa của khung tiền phạt đối với hành vi vi phạm được căn cứ vào mức tối thiểu và mức tối đa của khung tiền phạt quy định đối với mỗi người vượt quá quy định nhân với số người thực tế vượt quá quy định được phép chở của phương tiện."

46:
  code_name: 46
  full_name: Thẩm quyền lập biên bản vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ

46.1:
  code_name: 1
  full_name: "Các chức danh có thẩm quyền xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ được quy định tại Điều 42, Điều 43 và Điều 44 của Nghị định này."

46.2:
  code_name: 2
  full_name: "Công chức thuộc Thanh tra Sở Giao thông vận tải đang thi hành công vụ, nhiệm vụ có thẩm quyền lập biên bản đối với các hành vi vi phạm xảy ra trong phạm vi địa bàn quản lý của Thanh tra Sở Giao thông vận tải."

III.2:
  code_name: c
  full_name: "THỦ TỤC XỬ PHẠT"

47:
  code_name: 47
  full_name: Thủ tục xử phạt, nguyên tắc xử phạt đối với chủ phương tiện, người điều khiển phương tiện vi phạm quy định liên quan đến trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ

47.1:
  code_name: 1
  full_name: "Trong trường hợp chủ phương tiện vi phạm có mặt tại nơi xảy ra vi phạm thì người có thẩm quyền căn cứ vào hành vi vi phạm để lập biên bản vi phạm hành chính và tiến hành xử phạt theo quy định của pháp luật."

47.2:
  code_name: 2
  full_name: "Trong trường hợp chủ phương tiện vi phạm không có mặt tại nơi xảy ra vi phạm thì người có thẩm quyền căn cứ vào hành vi vi phạm để lập biên bản vi phạm hành chính đối với chủ phương tiện và tiến hành xử phạt theo quy định của pháp luật, người điều khiển phương tiện phải ký vào biên bản vi phạm hành chính với tư cách là người chứng kiến."

47.3:
  code_name: 3
  full_name: "Đối với những hành vi vi phạm mà cùng được quy định tại các điều khác nhau của Chương II của Nghị định này, trong trường hợp đối tượng vi phạm trùng nhau thì xử phạt như sau:"

47.3.a:
  code_name: a
  full_name: "Các hành vi vi phạm quy định về biển số, chứng nhận đăng ký xe, chứng nhận đăng ký xe tạm thời quy định tại Điều 13 (điểm a khoản 4; điểm a khoản 6; điểm a, điểm b khoản 7; điểm a khoản 8), Điều 14 (điểm a, điểm b, điểm c khoản 2; điểm a khoản 3), Điều 16 (điểm a khoản 1; điểm a, điểm c, điểm d, điểm đ khoản 2) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm đ, điểm e, điểm h khoản 8; điểm đ khoản 9; điểm a, điểm b khoản 12; điểm d khoản 13), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 32 của Nghị định này;"

47.3.b:
  code_name: b
  full_name: "Các hành vi vi phạm quy định về giấy chứng nhận, tem kiểm định an toàn kỹ thuật và bảo vệ môi trường của xe quy định tại Điều 13 (điểm a khoản 5; điểm a, điểm b khoản 6), Điều 16 (điểm đ khoản 1; điểm b, điểm đ khoản 2) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm b, điểm đ khoản 9; điểm a khoản 11), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 32 của Nghị định này;"

47.3.c:
  code_name: c
  full_name: "Các hành vi vi phạm quy định về thời gian lái xe, thời gian nghỉ giữa hai lần lái xe liên tục của người lái xe, phù hiệu quy định tại Điều 20 (điểm d khoản 6, khoản 7), Điều 21 (điểm b khoản 5, điểm c khoản 6) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm d khoản 9, điểm đ khoản 11), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 32 của Nghị định này;"

47.3.d:
  code_name: d
  full_name: "Các hành vi vi phạm quy định về niên hạn sử dụng của phương tiện quy định tại Điều 13 (điểm a khoản 9) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm c khoản 17), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm c khoản 17 Điều 32 của Nghị định này;"

47.3.đ:
  code_name: đ
  full_name: "Các hành vi vi phạm quy định về niên hạn sử dụng của phương tiện quy định tại Điều 13 (điểm c khoản 5) và các hành vi vi phạm tương ứng quy định tại Điều 26 (điểm i khoản 7), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm i khoản 7 Điều 26 của Nghị định này;"

47.3.e:
  code_name: e
  full_name: "Các hành vi vi phạm quy định về kích thước thùng xe, khoang chở hành lý (hầm xe), lắp thêm hoặc tháo bớt ghế, giường nằm trên xe ô tô quy định tại Điều 13 (điểm d khoản 3, điểm b khoản 4) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm d khoản 11, điểm h khoản 14), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 32 của Nghị định này;"

47.3.g:
  code_name: g
  full_name: "Các hành vi vi phạm quy định về lắp, sử dụng thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe trên xe ô tô quy định tại Điều 20 (điểm l khoản 5, điểm đ khoản 6), Điều 21 (điểm b khoản 3, điểm c khoản 5), Điều 27 (điểm c khoản 1, điểm a khoản 3) và các hành vi vi phạm tương ứng quy định tại Điều 26 (điểm c, điểm g khoản 7), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 26 của Nghị định này;"

47.3.h:
  code_name: h
  full_name: "Các hành vi vi phạm quy định về lắp, sử dụng thiết bị giám sát hành trình, thiết bị ghi nhận hình ảnh người lái xe trên xe ô tô quy định tại Điều 29 (khoản 1, khoản 3), Điều 30 (khoản 1, khoản 2) và các hành vi vi phạm tương ứng quy định tại Điều 32 (điểm m, điểm n khoản 7), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 32 của Nghị định này;"

47.3.i:
  code_name: i
  full_name: "Các hành vi vi phạm quy định về dây đai an toàn, hướng dẫn cho hành khách về an toàn giao thông, thoát hiểm khi xảy ra sự cố trên xe quy định tại Điều 20 (điểm h, điểm i khoản 3) và các hành vi vi phạm tương ứng quy định tại Điều 26 (điểm c khoản 2, điểm đ khoản 4) trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 26 của Nghị định này;"

47.3.k:
  code_name: k
  full_name: "Các hành vi vi phạm quy định về đón, trả khách; nhận, trả hàng quy định tại Điều 20 (khoản 8), Điều 21 (khoản 9) và các hành vi vi phạm tương ứng quy định tại Điều 26 (điểm c khoản 8), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm c khoản 8 Điều 26 của Nghị định này;"

47.3.l:
  code_name: l
  full_name: "Các hành vi vi phạm quy định về dụng cụ, thiết bị chuyên dùng để cứu hộ, hỗ trợ cứu hộ giao thông đường bộ quy định tại Điều 29 (khoản 2) và hành vi vi phạm tương ứng quy định tại Điều 32 (điểm o khoản 7), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm o khoản 7 Điều 32 của Nghị định này;"

47.3.m:
  code_name: m
  full_name: "Các hành vi vi phạm quy định về thiết bị ghi nhận hình ảnh trẻ em mầm non, học sinh và thiết bị có chức năng cảnh báo, chống bỏ quên trẻ em trên xe quy định tại Điều 27 (điểm b khoản 3) và hành vi vi phạm tương ứng quy định tại Điều 26 (điểm b khoản 6), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm b khoản 6 Điều 26 của Nghị định này;"

47.3.n:
  code_name: n
  full_name: "Các hành vi vi phạm quy định về màu sơn, biển báo dấu hiệu nhận biết của xe chở trẻ em mầm non, học sinh quy định tại Điều 27 (điểm c, điểm d khoản 3) và hành vi vi phạm tương ứng quy định tại Điều 26 (điểm c, điểm d khoản 6), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 26 của Nghị định này;"

47.3.o:
  code_name: o
  full_name: "Các hành vi vi phạm quy định về chở hàng siêu trường, siêu trọng, chở quá khổ, quá tải, quá số người quy định tại Điều 20, Điều 21, Điều 22, Điều 34 và các hành vi vi phạm tương ứng quy định tại Điều 32, trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại Điều 32 của Nghị định này;"

47.3.p:
  code_name: p
  full_name: "Các hành vi vi phạm quy định về vận chuyển hàng hóa là phương tiện vận tải, máy móc, thiết bị kỹ thuật, hàng dạng trụ quy định tại Điều 21 (điểm a khoản 10) và hành vi vi phạm tương ứng quy định tại Điều 32 (điểm đ khoản 13), trong trường hợp chủ phương tiện là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm đ khoản 13 Điều 32 của Nghị định này;"

47.3.q:
  code_name: q
  full_name: "Các hành vi vi phạm quy định về niêm yết thông tin (hành trình chạy xe) quy định tại Điều 20 (điểm k khoản 3) và hành vi vi phạm tương ứng quy định tại Điều 26 (điểm g khoản 4), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm g khoản 4 Điều 26 của Nghị định này;"

47.3.r:
  code_name: r
  full_name: "Các hành vi vi phạm quy định về không thực hiện đúng các nội dung thông tin đã niêm yết (tuyến đường, lịch trình, hành trình vận tải) quy định tại Điều 20 (điểm c khoản 3) và các hành vi vi phạm tương ứng quy định tại Điều 26 (điểm b khoản 7), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm b khoản 7 Điều 26 của Nghị định này;"

47.3.s:
  code_name: s
  full_name: "Các hành vi vi phạm quy định về lệnh vận chuyển, giấy vận tải quy định tại Điều 20 (điểm e khoản 5), Điều 21 (điểm đ khoản 2) và hành vi vi phạm tương ứng quy định tại Điều 26 (điểm đ khoản 2), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm đ khoản 2 Điều 26 của Nghị định này;"

47.3.t:
  code_name: t
  full_name: "Các hành vi vi phạm quy định về vận chuyển hàng hóa nguy hiểm mà không làm sạch hoặc không bóc (xóa) biểu trưng nguy hiểm trên phương tiện khi không tiếp tục vận chuyển loại hàng hóa đó quy định tại Điều 23 (khoản 1) và hành vi vi phạm tương ứng quy định tại Điều 26 (điểm e khoản 2), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại điểm e khoản 2 Điều 26 của Nghị định này."

47.4:
  code_name: 4
  full_name: "Đối với những hành vi vi phạm quy định về tải trọng, khổ giới hạn của phương tiện, của đường bộ quy định tại Điều 21, Điều 34 của Nghị định này, trong trường hợp chủ phương tiện, người điều khiển phương tiện vừa thực hiện hành vi vi phạm quy định tại Điều 21, vừa thực hiện hành vi vi phạm quy định tại Điều 34 của Nghị định này thì bị xử phạt về từng hành vi vi phạm; đối với những hành vi vi phạm được quy định tại điểm a khoản 4, điểm a khoản 5 Điều 34 của Nghị định này, trong trường hợp chủ phương tiện, người điều khiển phương tiện vừa thực hiện hành vi vi phạm quy định về tổng trọng lượng (khối lượng toàn bộ) của xe, vừa thực hiện hành vi vi phạm quy định về tải trọng trục xe thì bị xử phạt theo quy định của hành vi vi phạm có mức phạt tiền cao hơn."

47.5:
  code_name: 5
  full_name: "Đối với các hành vi vi phạm quy định về sử dụng lòng đường, vỉa hè vào mục đích khác, bảo vệ môi trường, chở người vượt quá quy định được phép chở của phương tiện, vi phạm quy định về tải trọng, khổ giới hạn của phương tiện, của đường bộ vi phạm về chằng buộc vận chuyển hàng hóa quy định tại Điều 12, Điều 17, Điều 20, Điều 21, Điều 26, Điều 32, Điều 34 của Nghị định này, người điều khiển phương tiện, chủ phương tiện, đơn vị kinh doanh vận tải, dịch vụ hỗ trợ vận tải, cá nhân, tổ chức vi phạm, xếp hàng lên xe ô tô thì buộc chấm dứt hành vi vi phạm theo quy định cụ thể sau đây:"

47.5.a:
  code_name: a
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm g khoản 2; khoản 7; khoản 9; điểm a khoản 11; điểm b khoản 14 Điều 12 thì buộc thu dọn thóc, lúa, rơm, rạ, nông, lâm, hải sản, máy tuốt lúa trên đường bộ; thu dọn chướng ngại vật, vật cản khác, vật sắc nhọn, chất gây trơn trượt trên đường bộ, hàng hóa, vật tư, hóa chất, chất thải; thu dọn phương tiện, máy móc, thiết bị, biển hiệu, biển quảng cáo theo hướng dẫn của lực lượng chức năng tại nơi phát hiện vi phạm;"

47.5.b:
  code_name: b
  full_name: "Thực hiện hành vi vi phạm quy định tại khoản 2, khoản 3, khoản 4 Điều 17 thì buộc thu dọn rác, chất phế thải, vật liệu, hàng hóa theo hướng dẫn của lực lượng chức năng tại nơi phát hiện vi phạm;"

47.5.c:
  code_name: c
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm a, điểm b, điểm d khoản 2; điểm a, điểm d khoản 5; điểm a, điểm b khoản 6; khoản 7; điểm a, điểm b khoản 8 Điều 21 thì buộc hạ phần hàng quá tải, dỡ phần hàng vượt quá kích thước quy định theo hướng dẫn của lực lượng chức năng tại nơi phát hiện vi phạm;"

47.5.d:
  code_name: d
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm a khoản 1; khoản 3; khoản 5 Điều 26 thì buộc hạ phần hàng xếp vượt quá tải trọng cho phép chở của xe trong trường hợp phương tiện được xếp hàng chưa rời khỏi khu vực xếp hàng;"

47.5.đ:
  code_name: đ
  full_name: "Thực hiện hành vi vi phạm quy định tại điểm đ, điểm e, điểm g khoản 7; điểm c khoản 9; điểm b, điểm c khoản 11; điểm a, điểm b, điểm c khoản 13; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g khoản 14; khoản 15; điểm a, điểm b khoản 16; điểm g khoản 17 Điều 32 thì buộc hạ phần hàng quá tải, dỡ phần hàng quá khổ theo hướng dẫn của lực lượng chức năng tại nơi phát hiện vi phạm;"

47.5.e:
  code_name: e
  full_name: "Thực hiện hành vi vi phạm quy định tại khoản 1; khoản 2; điểm a, điểm c, điểm d khoản 3; khoản 4; khoản 5 Điều 34 thì buộc hạ phần hàng quá tải, dỡ phần hàng quá khổ theo hướng dẫn của lực lượng chức năng tại nơi phát hiện vi phạm;"

47.5.g:
  code_name: g
  full_name: "Thực hiện hành vi vi phạm quy định tại khoản 2, khoản 4 Điều 20; khoản 5, khoản 6, các điểm d, đ khoản 17 Điều 32 thì buộc bố trí phương tiện khác để chở số hành khách vượt quá quy định được phép chở của phương tiện;"

47.5.h:
  code_name: h
  full_name: "Thực hiện hành vi vi phạm quy định tại khoản 1, điểm đ khoản 8, khoản 10 Điều 21 thì buộc chằng buộc hàng hóa theo quy định; buộc dỡ hàng hóa trên nóc buồng lái; buộc chốt, đóng (cố định) cửa sau, cửa bên thùng xe; buộc sử dụng cơ cấu khóa hãm công-ten-nơ theo quy định."

47.6:
  code_name: 6
  full_name: "Chủ phương tiện bị xử phạt theo quy định tại Nghị định này là một trong các đối tượng sau đây:"

47.6.a:
  code_name: a
  full_name: "Cá nhân, tổ chức đứng tên trong chứng nhận đăng ký xe;"

47.6.b:
  code_name: b
  full_name: "Trường hợp người điều khiển phương tiện là chồng (vợ) của cá nhân đứng tên trong chứng nhận đăng ký xe thì người điều khiển phương tiện là đối tượng để áp dụng xử phạt như chủ phương tiện;"

47.6.c:
  code_name: c
  full_name: "Đối với phương tiện được thuê tài chính của tổ chức có chức năng cho thuê tài chính thì cá nhân, tổ chức thuê phương tiện là đối tượng để áp dụng xử phạt như chủ phương tiện;"

47.6.d:
  code_name: d
  full_name: "Đối với phương tiện thuộc sở hữu của thành viên hợp tác xã và được hợp tác xã đứng tên làm thủ tục đăng ký kinh doanh vận tải bằng xe ô tô thì hợp tác xã đó là đối tượng để áp dụng xử phạt như chủ phương tiện;"

47.6.đ:
  code_name: đ
  full_name: "Trường hợp phương tiện do tổ chức, cá nhân có quyền sử dụng hợp pháp (theo hợp đồng thuê phương tiện bằng văn bản với tổ chức, cá nhân khác hoặc hợp đồng hợp tác kinh doanh theo quy định của pháp luật) trực tiếp đứng tên làm thủ tục đăng ký kinh doanh vận tải bằng xe ô tô cho phương tiện, kinh doanh dịch vụ cứu hộ giao thông đường bộ, cứu thương thì tổ chức, cá nhân đó là đối tượng để áp dụng xử phạt như chủ phương tiện;"

47.6.e:
  code_name: e
  full_name: "Đối với phương tiện chưa làm thủ tục cấp mới chứng nhận đăng ký xe và biển số xe hoặc chưa làm thủ tục cấp chứng nhận đăng ký xe trong trường hợp thay đổi chủ xe theo quy định thì cá nhân, tổ chức đã mua, được chuyển nhượng, được trao đổi, được tặng cho, được thừa kế là đối tượng để áp dụng xử phạt như chủ phương tiện;"

47.6.g:
  code_name: g
  full_name: "Đối với tổ hợp xe (gồm xe ô tô kéo theo rơ moóc hoặc sơ mi rơ moóc tham gia giao thông trên đường bộ), trong trường hợp chủ của xe ô tô không đồng thời là chủ của rơ moóc, sơ mi rơ moóc thì chủ của xe ô tô (cá nhân, tổ chức quy định tại điểm a khoản này hoặc cá nhân, tổ chức quy định tại điểm b, điểm c, điểm d, điểm đ, điểm e khoản này) là đối tượng để áp dụng xử phạt như chủ phương tiện đối với các vi phạm liên quan đến rơ moóc, sơ mi rơ moóc được kéo theo tham gia giao thông trên đường bộ."

47.7:
  code_name: 7
  full_name: "Khi xử phạt đối với chủ phương tiện quy định tại khoản 6 Điều này, thời hạn ra quyết định xử phạt có thể được kéo dài để xác minh đối tượng bị xử phạt theo quy định tại khoản 1 Điều 66 của Luật Xử lý vi phạm hành chính."

47.8:
  code_name: 8
  full_name: "Đối với trường hợp hành vi vi phạm hành chính được phát hiện thông qua sử dụng phương tiện, thiết bị kỹ thuật nghiệp vụ mà cơ quan chức năng chưa dừng ngay được phương tiện để xử lý thì thực hiện như sau:"

47.8.a:
  code_name: a
  full_name: "Cơ quan chức năng gửi thông báo yêu cầu chủ phương tiện và cá nhân, tổ chức có liên quan (nếu có) đến trụ sở cơ quan, đơn vị của người có thẩm quyền xử phạt vi phạm hành chính để giải quyết vụ việc vi phạm. Việc thông báo được thực hiện bằng văn bản hoặc thực hiện thông báo bằng phương thức điện tử thông qua ứng dụng giao thông trên thiết bị di động dành cho công dân (sau đây viết gọn là Ứng dụng giao thông trên thiết bị di động) do Bộ Công an xây dựng, quản lý, vận hành khi đáp ứng điều kiện về cơ sở hạ tầng, kỹ thuật, thông tin; đồng thời cập nhật thông tin về phương tiện vi phạm trên Trang thông tin điện tử của Cục Cảnh sát giao thông;"

47.8.b:
  code_name: b
  full_name: |+
    Chủ phương tiện có nghĩa vụ phải hợp tác với cơ quan chức năng để xác định người đã điều khiển phương tiện thực hiện hành vi vi phạm.

    Trường hợp chủ phương tiện là cá nhân, nếu không hợp tác với cơ quan chức năng, không chứng minh hoặc không giải trình được mình không phải là người đã điều khiển phương tiện thực hiện hành vi vi phạm thì bị xử phạt đối với hành vi vi phạm được phát hiện;

    Trường hợp chủ phương tiện là tổ chức, nếu không hợp tác với cơ quan chức năng, không giải trình để xác định được người đã điều khiển phương tiện thực hiện hành vi vi phạm thì bị xử phạt vi phạm hành chính đối với tổ chức thực hiện hành vi vi phạm được phát hiện, trừ trường hợp phương tiện bị chiếm đoạt, sử dụng trái phép;

47.8.c:
  code_name: c
  full_name: "chuyển kết quả thu thập được bằng phương tiện, thiết bị kỹ thuật nghiệp vụ đến người có thẩm quyền xử phạt vi phạm hành chính để lập biên bản vi phạm hành chính và ra quyết định xử phạt vi phạm hành chính thực hiện theo quy định của Chính phủ về danh mục, việc quản lý, sử dụng phương tiện, thiết bị kỹ thuật nghiệp vụ và quy trình thu thập, sử dụng dữ liệu thu được từ phương tiện, thiết bị kỹ thuật do cá nhân, tổ chức cung cấp để phát hiện vi phạm hành chính."

47.9:
  code_name: 9
  full_name: "Người có thẩm quyền xử phạt được sử dụng các thông tin trong Cơ sở dữ liệu về trật tự, an toàn giao thông đường bộ theo quy định của Luật Trật tự, an toàn giao thông đường bộ, Luật Xử lý vi phạm hành chính, pháp luật về đo lường để làm căn cứ xác định hành vi vi phạm đối với cá nhân, tổ chức khi thực hiện một trong các hành vi vi phạm quy định tại Nghị định này."

"47.10":
  code_name: 10
  full_name: "Việc xác minh để phát hiện hành vi vi phạm quy định tại điểm a khoản 3, điểm h khoản 7 Điều 32 của Nghị định này được thực hiện thông qua công tác điều tra, giải quyết vụ tai nạn giao thông; qua công tác đăng ký xe; qua công tác xử lý vụ việc vi phạm hành chính tại trụ sở đơn vị."

47.11:
  code_name: 11
  full_name: "Trường hợp quá thời hạn hẹn đến giải quyết vụ việc vi phạm được ghi trong biên bản vi phạm hành chính hoặc trong thông báo của người có thẩm quyền xử phạt hoặc quá thời hạn thi hành quyết định xử phạt mà chủ phương tiện vi phạm, người vi phạm chưa thực hiện giải quyết vụ việc vi phạm theo quy định hoặc chưa chấp hành quyết định xử phạt thì người có thẩm quyền xử phạt gửi thông báo cho cơ quan đăng kiểm (đối với phương tiện có quy định phải kiểm định), cơ quan đăng ký xe, cơ quan cấp giấy phép lái xe (nếu đã xác định được người vi phạm). Việc gửi thông báo được thực hiện bằng văn bản hoặc thực hiện thông báo bằng phương thức điện tử thông qua kết nối, chia sẻ dữ liệu khi đáp ứng điều kiện về cơ sở hạ tầng, kỹ thuật, thông tin."

47.11.a:
  code_name: a
  full_name: "Cơ quan đăng kiểm, cơ quan đăng ký xe, cơ quan cấp giấy phép lái xe trước khi thực hiện đăng kiểm, đăng ký xe, cấp, đổi, cấp lại giấy phép lái xe có trách nhiệm tra cứu dữ liệu phương tiện vi phạm, người vi phạm được cơ quan Cảnh sát giao thông gửi thông báo đến;"

47.11.b:
  code_name: b
  full_name: "Trường hợp khi tra cứu dữ liệu theo quy định tại điểm a khoản này nếu có thông tin về phương tiện vi phạm, người vi phạm thì chưa giải quyết việc đăng kiểm, đăng ký phương tiện vi phạm, chưa cấp, đổi, cấp lại giấy phép lái xe đối với người vi phạm;"

47.11.c:
  code_name: c
  full_name: "Sau khi chủ phương tiện, người vi phạm đã giải quyết vụ việc vi phạm theo quy định, người có thẩm quyền xử phạt phải gửi thông báo ngay cho cơ quan đăng kiểm, cơ quan đăng ký xe, cơ quan cấp giấy phép lái xe bằng văn bản hoặc theo hình thức kết nối, chia sẻ dữ liệu khi đáp ứng điều kiện về cơ sở hạ tầng, kỹ thuật, thông tin để thực hiện việc đăng kiểm, đăng ký xe, cấp, đổi, cấp lại giấy phép lái xe theo quy định."

47.12:
  code_name: 12
  full_name: "Việc gửi quyết định xử phạt vi phạm hành chính, quyết định tạm giữ tang vật, phương tiện, giấy phép, chứng chỉ hành nghề theo thủ tục hành chính và các biểu mẫu khác trong xử phạt vi phạm hành chính thực hiện theo quy định của Luật Xử lý vi phạm hành chính và có thể gửi cho người vi phạm theo tài khoản đã đăng ký trên Cổng dịch vụ công Quốc gia, Cổng dịch vụ công Bộ Công an (sau đây viết gọn là Cổng dịch vụ công), tài khoản định danh điện tử trên ứng dụng định danh quốc gia, Ứng dụng giao thông trên thiết bị di động khi đáp ứng điều kiện về cơ sở hạ tầng kỹ thuật thông tin."

48:
  code_name: 48
  full_name: Tạm giữ phương tiện, giấy tờ có liên quan đến người điều khiển và phương tiện vi phạm

48.1:
  code_name: 1
  full_name: "Để ngăn chặn ngay hành vi vi phạm hành chính, người có thẩm quyền được phép tạm giữ phương tiện trước khi ra quyết định xử phạt theo quy định tại điểm b khoản 1, khoản 2, khoản 8 Điều 125 của Luật Xử lý vi phạm hành chính đối với những hành vi vi phạm được quy định tại các điều, khoản, điểm sau đây của Nghị định này:"

48.1.a:
  code_name: a
  full_name: "Điểm g khoản 5; điểm c khoản 6; điểm b khoản 7; điểm a khoản 9; điểm a, điểm b, điểm c, điểm d khoản 11; khoản 12; khoản 14 Điều 6;"

48.1.b:
  code_name: b
  full_name: "Điểm a khoản 6; điểm b khoản 7; điểm b khoản 8; điểm a, điểm b, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm i, điểm k khoản 9; khoản 11 Điều 7;"

48.1.c:
  code_name: c
  full_name: "Điểm c khoản 6; điểm a khoản 7; điểm b khoản 8; điểm a, điểm b, điểm c, điểm d khoản 9 Điều 8;"

48.1.d:
  code_name: d
  full_name: "Điểm p khoản 1; điểm d khoản 3; điểm b, điểm c, điểm d (trong trường hợp người vi phạm là người dưới 16 tuổi và điều khiển phương tiện) khoản 4; khoản 5 Điều 9;"

48.1.đ:
  code_name: đ
  full_name: "Khoản 10 (trong trường hợp người vi phạm là người điều khiển phương tiện); điểm a khoản 14 (trong trường hợp người vi phạm là người điều khiển phương tiện) Điều 12;"

48.1.e:
  code_name: e
  full_name: "Điểm a khoản 4; điểm a, điểm b khoản 5; khoản 6; điểm b khoản 7; điểm a khoản 8; khoản 9 Điều 13;"

48.1.g:
  code_name: g
  full_name: "Điểm a, điểm b khoản 2; điểm a khoản 3; khoản 4 Điều 14;"

48.1.h:
  code_name: h
  full_name: "Điểm a, điểm đ khoản 1; điểm b, điểm c, điểm d, điểm đ khoản 2; khoản 3 Điều 16;"

48.1.i:
  code_name: i
  full_name: "Khoản 1; điểm a khoản 4; khoản 5; khoản 6; khoản 7; khoản 8; khoản 9 Điều 18;"

48.1.k:
  code_name: k
  full_name: "Khoản 2 Điều 19;"

48.1.l:
  code_name: l
  full_name: "Điểm b, điểm đ, điểm e, điểm h khoản 8; điểm b, điểm đ khoản 9; khoản 10; điểm a khoản 11; điểm a, điểm b, điểm d khoản 12; điểm d khoản 13; điểm i khoản 14; điểm c khoản 16; khoản 17 Điều 32;"

48.1.m:
  code_name: m
  full_name: "Điểm b khoản 5 Điều 34;"

48.1.n:
  code_name: n
  full_name: "Khoản 3 Điều 35;"

48.1.o:
  code_name: o
  full_name: "Các hành vi vi phạm khác quy định tại Nghị định này thuộc trường hợp thật cần thiết cần phải ngăn chặn ngay hành vi vi phạm hành chính mà nếu không tạm giữ thì sẽ gây hậu quả nghiêm trọng cho xã hội."

48.2:
  code_name: 2
  full_name: "Để bảo đảm thi hành quyết định xử phạt vi phạm hành chính hoặc để xác minh tình tiết làm căn cứ ra quyết định xử phạt, người có thẩm quyền xử phạt có thể quyết định tạm giữ phương tiện, giấy tờ có liên quan đến người điều khiển và phương tiện vi phạm một trong các hành vi quy định tại Nghị định này theo quy định tại điểm a, điểm c khoản 1; khoản 2; khoản 6; khoản 7; khoản 8 Điều 125 của Luật Xử lý vi phạm hành chính. Khi bị tạm giữ giấy tờ theo quy định tại khoản 6 Điều 125 của Luật Xử lý vi phạm hành chính, nếu quá thời hạn hẹn đến giải quyết vụ việc vi phạm ghi trong biên bản vi phạm hành chính, người vi phạm chưa thực hiện giải quyết vụ việc vi phạm theo quy định mà vẫn tiếp tục điều khiển phương tiện hoặc đưa phương tiện ra tham gia giao thông thì bị áp dụng xử phạt như hành vi không có giấy tờ."

48.3:
  code_name: 3
  full_name: "Đối với trường hợp tại thời điểm kiểm tra, người điều khiển phương tiện không xuất trình được một, một số hoặc tất cả các giấy tờ (giấy phép lái xe, chứng nhận đăng ký xe (hoặc bản sao chứng nhận đăng ký xe có chứng thực kèm theo bản gốc giấy biên nhận còn hiệu lực của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài trong trường hợp tổ chức tín dụng, chi nhánh ngân hàng nước ngoài giữ bản gốc chứng nhận đăng ký xe), giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường) theo quy định (bản giấy hoặc thông tin của các giấy tờ được tích hợp trong tài khoản định danh điện tử) thì xử lý như sau:"

48.3.a:
  code_name: a
  full_name: "Người cỏ thẩm quyền tiến hành lập biên bản vi phạm hành chính đối với người điều khiển phương tiện về hành vi không có giấy tờ (tương ứng với những loại giấy tờ không xuất trình được), đồng thời lập biên bản vi phạm hành chính đối với chủ phương tiện về những hành vi vi phạm tương ứng quy định tại Điều 32 của Nghị định này và tạm giữ phương tiện theo quy định;"

48.3.b:
  code_name: b
  full_name: "Trong thời hạn hẹn đến giải quyết vụ việc vi phạm ghi trong biên bản vi phạm hành chính, nếu người điều khiển phương tiện kinh doanh vận tải xuất trình được các giấy tờ hoặc thông tin của các giấy tờ được tích hợp trong tài khoản định danh điện tử theo quy định thì người có thẩm quyền ra quyết định xử phạt về hành vi không mang theo giấy tờ đối với người điều khiển phương tiện và không xử phạt đối với chủ phương tiện;"

48.3.c:
  code_name: c
  full_name: "Trong thời hạn hẹn đến giải quyết vụ việc vi phạm ghi trong biên bản vi phạm hành chính, nếu người vi phạm (trừ trường hợp quy định tại điểm b khoản này) xuất trình được các giấy tờ hoặc thông tin của các giấy tờ được tích hợp trong tài khoản định danh điện tử theo quy định thì người có thẩm quyền không ra quyết định xử phạt vi phạm hành chính đối với hành vi vi phạm không có giấy tờ, không mang theo giấy tờ và không xử phạt đối với chủ phương tiện;"

48.3.d:
  code_name: d
  full_name: "Quá thời hạn hẹn đến giải quyết vụ việc vi phạm ghi trong biên bản vi phạm hành chính, người vi phạm mới xuất trình hoặc không xuất trình được giấy tờ hoặc thông tin của các giấy tờ được tích hợp trong tài khoản định danh điện tử theo quy định thì phải chấp hành quyết định xử phạt vi phạm hành chính theo quy định đối với các hành vi vi phạm đã ghi trong biên bản vi phạm hành chính."

48.4:
  code_name: 4
  full_name:
    Khi phương tiện bị tạm giữ theo quy định tại khoản 1, khoản 2, khoản 3 Điều này, chủ phương tiện phải chịu mọi chi phí (nếu có) cho việc sử dụng phương tiện khác thay thế để vận chuyển người, hàng hóa được chở trên phương tiện bị tạm giữ.

    Trường hợp khi tạm giữ phương tiện vi phạm hành chính nhưng người điều khiển phương tiện, chủ phương tiện không có mặt tại nơi xảy ra vi phạm hoặc có mặt nhưng không chấp hành yêu cầu của người có thẩm quyền tạm giữ hoặc không đáp ứng yêu cầu, điều kiện theo quy định để điều khiển phương tiện hoặc phương tiện không bảo đảm chất lượng an toàn kỹ thuật và bảo vệ môi trường theo quy định thì người có thẩm quyền tạm giữ thực hiện việc di chuyển phương tiện vi phạm về nơi tạm giữ theo quy định; nếu không đủ điều kiện thực hiện thì người có thẩm quyền tạm giữ được thuê tổ chức, cá nhân thực hiện việc di chuyển phương tiện đó. Người điều khiển phương tiện hoặc chủ phương tiện vi phạm phải trả chi phí cho việc thuê di chuyển phương tiện đó về nơi tạm giữ.

III.3:
  code_name: c
  full_name: "TRÌNH TỰ, THỦ TỤC, THẨM QUYỀN TRỪ ĐIỂM, PHỤC HỒI ĐIỂM GIẤY PHÉP LÁI XE"

49:
  code_name: 49
  full_name: |+
    Dữ liệu về điểm, trừ điểm, phục hồi điểm giấy phép lái xe

    Dữ liệu về điểm, trừ điểm, phục hồi điểm giấy phép lái xe được quản lý, lưu trữ trên môi trường điện tử, trong Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ do Bộ Công an xây dựng, quản lý, vận hành.

50:
  code_name: 50
  full_name: Nguyên tắc, thẩm quyền, trình tự, thủ tục trừ điểm giấy phép lái xe

50.1:
  code_name: 1
  full_name: "Nguyên tắc trừ điểm giấy phép lái xe"

50.1.a:
  code_name: a
  full_name: "Việc trừ điểm giấy phép lái xe được thực hiện ngay sau khi quyết định xử phạt vi phạm hành chính đối với hành vi vi phạm mà theo quy định của Nghị định này bị trừ điểm giấy phép lái xe có hiệu lực thi hành;"

50.1.b:
  code_name: b
  full_name: "Trường hợp cá nhân thực hiện nhiều hành vi vi phạm hành chính hoặc vi phạm hành chính nhiều lần mà bị xử phạt trong cùng một lần, nếu có từ 02 hành vi vi phạm trở lên theo quy định bị trừ điểm giấy phép lái xe thì chỉ áp dụng trừ điểm đối với hành vi vi phạm bị trừ nhiều điểm nhất;"

50.1.c:
  code_name: c
  full_name: "Trường hợp số điểm còn lại của giấy phép lái xe ít hơn số điểm bị trừ thì áp dụng trừ hết số điểm còn lại của giấy phép lái xe đó;"

50.1.d:
  code_name: d
  full_name: "Trường hợp giấy phép lái xe tích hợp giấy phép lái xe không thời hạn (xe mô tô, xe tương tự xe mô tô) và giấy phép lái xe có thời hạn (xe ô tô, xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ) thì người có thẩm quyền xử phạt thực hiện trừ điểm đối với giấy phép lái xe không thời hạn khi người điều khiển xe mô tô, xe tương tự xe mô tô hoặc trừ điểm giấy phép lái xe có thời hạn khi người điều khiển xe ô tô, xe tương tự xe ô tô, xe chở người bốn bánh có gắn động cơ, xe chở hàng bốn bánh có gắn động cơ thực hiện hành vi vi phạm hành chính có quy định bị trừ điểm giấy phép lái xe;"

50.1.đ:
  code_name: đ
  full_name: "Không trừ điểm giấy phép lái xe khi giấy phép lái xe đó đang trong thời hạn bị tước quyền sử dụng giấy phép lái xe."

50.2:
  code_name: 2
  full_name: |+
    Thẩm quyền trừ điểm giấy phép lái xe

    Người có thẩm quyền áp dụng hình thức xử phạt tước quyền sử dụng giấy phép, chứng chỉ hành nghề có thời hạn hoặc đình chỉ hoạt động có thời hạn quy định tại Chương II Phần thứ hai của Luật Xử lý vi phạm hành chính, Mục 1 Chương III của Nghị định này và có thẩm quyền xử phạt vi phạm hành chính đối với hành vi vi phạm có quy định trừ điểm giấy phép lái xe thì có thẩm quyền trừ điểm giấy phép lái xe đối với hành vi vi phạm đó.

50.3:
  code_name: 3
  full_name: "Trình tự, thủ tục trừ điểm giấy phép lái xe"

50.3.a:
  code_name: a
  full_name: |+
    - Ngay sau khi quyết định xử phạt vi phạm hành chính có hiệu lực thi hành, dữ liệu trừ điểm giấy phép lái xe của người bị xử phạt sẽ được cập nhật tự động vào Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ, người có thẩm quyền trừ điểm giấy phép lái xe thông báo cho người bị trừ điểm giấy phép lái xe biết việc trừ điểm.

    - Trường hợp Chủ tịch Ủy ban nhân dân cấp huyện, Chủ tịch Ủy ban nhân dân cấp tỉnh ra quyết định xử phạt vi phạm hành chính đối với hành vi vi phạm có trừ điểm giấy phép lái xe thì Trưởng Công an cấp huyện hoặc Trưởng phòng Cảnh sát giao thông Công an cấp tỉnh có trách nhiệm cập nhật dữ liệu trừ điểm giấy phép lái xe vào Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ;

50.3.b:
  code_name: b
  full_name: "Việc thông báo trừ điểm giấy phép lái xe thực hiện bằng văn bản theo mẫu quy định của Bộ trưởng Bộ Công an và được giao trực tiếp hoặc gửi qua dịch vụ bưu chính hoặc thực hiện thông báo bằng phương thức điện tử thông qua tài khoản của công dân đăng ký trên Cổng dịch vụ công, Ứng dụng giao thông trên thiết bị di động khi đáp ứng điều kiện về cơ sở hạ tầng, kỹ thuật, thông tin; đồng thời cập nhật thông tin về giấy phép lái xe bị trừ điểm trên Trang thông tin điện tử của Cục Cảnh sát giao thông. Trường hợp giấy phép lái xe được thể hiện dưới hình thức thông điệp dữ liệu thì cơ quan, người có thẩm quyền thực hiện cập nhật trạng thái trừ điểm giấy phép lái xe trong căn cước điện tử, tài khoản định danh điện tử trên ứng dụng định danh quốc gia."

51:
  code_name: 51
  full_name: Thẩm quyền, trình tự, thủ tục phục hồi điểm giấy phép lái xe

51.1:
  code_name: 1
  full_name: "Thẩm quyền phục hồi điểm giấy phép lái xe"

51.1.a:
  code_name: a
  full_name: "Cục trưởng Cục Cảnh sát giao thông có trách nhiệm quản lý, vận hành Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ để thực hiện cập nhật, tự động phục hồi điểm giấy phép lái xe đối với trường hợp quy định tại khoản 2 Điều này;"

51.1.b:
  code_name: b
  full_name: "Cục trưởng Cục Cảnh sát giao thông, Trưởng phòng Cảnh sát giao thông nơi tổ chức kiểm tra kiến thức pháp luật về trật tự, an toàn giao thông đường bộ có thẩm quyền phục hồi điểm cho giấy phép lái xe đối với trường hợp quy định tại khoản 3 Điều này."

51.2:
  code_name: 2
  full_name: "Trình tự, thủ tục phục hồi điểm giấy phép lái xe đối với trường hợp giấy phép lái xe chưa bị trừ hết điểm và không bị trừ điểm trong thời hạn 12 tháng từ ngày bị trừ điểm gần nhất"

51.2.a:
  code_name: a
  full_name: "Khi đủ thời hạn 12 tháng, kể từ ngày bị trừ điểm giấy phép lái xe gần nhất, dữ liệu điểm giấy phép lái xe sẽ được tự động phục hồi đủ 12 điểm (gồm cả giấy phép lái xe đang trong thời hạn bị tước quyền sử dụng) và cập nhật tự động trong Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ;"

51.2.b:
  code_name: b
  full_name: "Ngay sau khi dữ liệu điểm giấy phép lái xe được phục hồi, Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ sẽ tự động chuyển thông tin thông báo cho người được phục hồi điểm giấy phép lái xe biết việc phục hồi điểm theo quy định tại điểm c khoản này;"

51.2.c:
  code_name: c
  full_name: "Việc thông báo phục hồi điểm giấy phép lái xe thực hiện bằng phương thức điện tử thông qua tài khoản của công dân đăng ký trên Cổng dịch vụ công, Ứng dụng giao thông trên thiết bị di động; đồng thời cập nhật thông tin về giấy phép lái xe được phục hồi điểm trên Trang thông tin điện tử của Cục Cảnh sát giao thông. Trường hợp giấy phép lái xe được thể hiện dưới hình thức thông điệp dữ liệu thì thực hiện cập nhật trạng thái phục hồi điểm giấy phép lái xe trong căn cước điện tử, tài khoản định danh điện tử trên ứng dụng định danh quốc gia."

51.3:
  code_name: 3
  full_name: "Trình tự, thủ tục phục hồi điểm giấy phép lái xe đối với trường hợp giấy phép lái xe bị trừ hết điểm"

51.3.a:
  code_name: a
  full_name: "Sau khi người có giấy phép lái xe bị trừ hết điểm tham gia kiểm tra nội dung kiến thức pháp luật về trật tự, an toàn giao thông đường bộ và đạt yêu cầu, kết quả kiểm tra được cập nhật vào phần mềm kiểm tra kiến thức pháp luật về trật tự, an toàn giao thông đường bộ và đồng bộ dữ liệu với Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ, dữ liệu điểm giấy phép lái xe sẽ được phục hồi đủ 12 điểm và cập nhật tự động trong Cơ sở dữ liệu về xử lý vi phạm hành chính về trật tự, an toàn giao thông đường bộ;"

51.3.b:
  code_name: b
  full_name: "Ngay sau khi dữ liệu điểm giấy phép lái xe được phục hồi đủ 12 điểm thì người có thẩm quyền quy định tại điểm b khoản 1 Điều này thông báo cho người được phục hồi điểm giấy phép lái xe biết việc phục hồi điểm;"

51.3.c:
  code_name: c
  full_name: "Việc thông báo phục hồi điểm giấy phép lái xe thực hiện bằng văn bản theo mẫu quy định của Bộ trưởng Bộ Công an và được giao trực tiếp hoặc gửi qua dịch vụ bưu chính hoặc thực hiện thông báo bằng phương thức điện tử thông qua tài khoản của công dân đăng ký trên Cổng dịch vụ công, Ứng dụng giao thông trên thiết bị di động; đồng thời cập nhật thông tin về giấy phép lái xe được phục hồi điểm trên Trang thông tin điện tử của Cục Cảnh sát giao thông. Trường hợp giấy phép lái xe được thể hiện dưới hình thức thông điệp dữ liệu thì cơ quan, người có thẩm quyền thực hiện cập nhật trạng thái phục hồi điểm giấy phép lái xe trong căn cước điện tử, tài khoản định danh điện tử trên ứng dụng định danh quốc gia."

IV:
  code_name: IV
  full_name: ĐIỀU KHOẢN THI HÀNH

52:
  code_name: 52
  full_name: Sửa đổi, bổ sung một số điều của Nghị định số 100/2019/NĐ-CP ngày 30 tháng 12 năm 2019 của Chính phủ quy định xử phạt vi phạm hành chính trong lĩnh vực giao thông đường bộ và đường sắt đã được sửa đổi, bổ sung một số điều theo Nghị định số 123/2021/NĐ-CP ngày 28 tháng 12 năm 2021 của Chính phủ sửa đổi, bổ sung một số điều của các Nghị định quy định xử phạt vi phạm hành chính trong lĩnh vực hàng hải; giao thông đường bộ, đường sắt; hàng không dân dụng

52.1:
  code_name: 1
  full_name: |+
    Bổ sung khoản 2a vào sau khoản 2 Điều 1 như sau:

    “2a. Hình thức, mức xử phạt, biện pháp khắc phục hậu quả đối với từng hành vi vi phạm hành chính; thẩm quyền lập biên bản, thẩm quyền xử phạt, mức phạt tiền cụ thể đối với từng chức danh về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ thì áp dụng quy định tại Nghị định quy định xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ; trừ điểm, phục hồi điểm giấy phép lái xe”.

52.2:
  code_name: 2
  full_name: "Sửa đổi, bổ sung một số điểm của khoản 6 Điều 28 như sau:"

52.2.a:
  code_name: a
  full_name: |+
    Sửa đổi, bổ sung điểm d khoản 6 Điều 28 như sau:

    “d) Không thực hiện đúng các nội dung đã đăng ký, niêm yết về: giá cước; giá dịch vụ; tiêu chuẩn chất lượng dịch vụ vận tải, dịch vụ hỗ trợ vận tải;”;

52.2.b:
  code_name: b
  full_name: |+
    Sửa đổi, bổ sung điểm i khoản 6 Điều 28 như sau:

    “i) Sử dụng phương tiện kinh doanh vận tải có chất lượng không bảo đảm điều kiện của hình thức kinh doanh đã đăng ký;”.

52.3:
  code_name: 3
  full_name: |+
    Sửa đổi, bổ sung điểm a, điểm b khoản 10 Điều 28 như sau:

    “a) Thực hiện hành vi vi phạm quy định tại điểm a, điểm b, điểm d, điểm đ, điểm h, điểm l, điểm o, điểm p, điểm r, điểm s, điểm t khoản 4; điểm d, điểm i, điểm k, điểm l, điểm n, điểm q khoản 6; điểm e khoản 7 Điều này bị tước quyền sử dụng phù hiệu từ 01 tháng đến 03 tháng (nếu có hoặc đã được cấp) đối với xe vi phạm;”

    “b. Thực hiện hành vi vi phạm quy định tại điểm i, điểm k khoản 4; điểm h khoản 6; điểm b khoản 7 Điều này bị tước quyền sử dụng giấy phép kinh doanh vận tải từ 01 tháng đến 03 tháng;”.

52.4:
  code_name: 4
  full_name: |+
    Sửa đổi, bổ sung điểm h khoản 11 Điều 28 như sau:

    “h) Thực hiện hành vi vi phạm quy định tại điểm n khoản 6 Điều này buộc lắp đặt đồng hồ tính tiền cước, thiết bị in hóa đơn trên xe theo đúng quy định;”.

52.5:
  code_name: 5
  full_name: "Sửa đổi, bổ sung một số điểm, khoản của Điều 74 như sau:"

52.5.a:
  code_name: a
  full_name: |+
    Sửa đổi, bổ sung điểm b khoản 2 Điều 74 như sau:

    - “b) Điểm a, điểm b, điểm d, điểm đ khoản 2; điểm b, điểm c, điểm d, điểm e khoản 3; khoản 4; điểm b khoản 5; điểm a, điểm b, điểm c, điểm d, điểm h khoản 6 Điều 12;”;

52.5.b:
  code_name: b
  full_name: |+
    Sửa đổi, bổ sung điểm e khoản 2 Điều 74 như sau:

    - “e) Điểm a, điểm b, điểm c, điểm d, điểm đ, điểm i khoản 2; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm p khoản 4; điểm d, điểm i, điểm n, điểm q khoản 6; điểm a, điểm b, điểm c khoản 7 Điều 28;”;

52.5.c:
  code_name: c
  full_name: |+
    Sửa đổi, bổ sung điểm g khoản 2 Điều 74 như sau:

    - “g) Điều 31;”;

52.5.d:
  code_name: d
  full_name: |+
    Sửa đổi, bổ sung điểm m khoản 5 Điều 74 như sau:

    - “m) Điểm a, điểm b, điểm c, điểm d, điểm đ, điểm i khoản 2; điểm b, điểm c khoản 3; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm h, điểm i, điểm k, điểm l, điểm m, điểm n, điểm o, điểm p, điểm r, điểm s, điểm t khoản 4; điểm a, điểm b, điểm d, điểm h, điểm i, điểm k, điểm l, điểm n, điểm q khoản 6; điểm a, điểm b, điểm c, điểm d, điểm e, điểm g, điểm k khoản 7; điểm c, điểm d khoản 8 Điều 28;”;

52.5.đ:
  code_name: đ
  full_name: |+
    Sửa đổi, bổ sung điểm o khoản 5 Điều 74 như sau:

    - “o) Điều 31;”.

52.6:
  code_name: 6
  full_name: "Sửa đổi, bổ sung một số điểm, khoản của Điều 80 như sau:"

52.6.a:
  code_name: a
  full_name: |+
    Sửa đổi, bổ sung điểm i khoản 3 Điều 80 như sau:

    - “i) Các hành vi vi phạm quy định về giá cước quy định tại Điều 23 (điểm l khoản 3), Điều 31 (khoản 2, khoản 3) và các hành vi vi phạm tương ứng quy định tại Điều 28 (điểm d khoản 6), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện hoặc là nhân viên phục vụ trên xe thì bị xử phạt theo quy định tại điểm d khoản 6 Điều 28 của Nghị định này;”;

52.6.b:
  code_name: b
  full_name: |+
    Sửa đổi, bổ sung điểm l khoản 3 Điều 80 như sau:

    - “l) Các hành vi vi phạm quy định về kinh doanh vận tải hành khách theo hợp đồng quy định tại Điều 23 (điểm n khoản 5) và các hành vi vi phạm tương ứng quy định tại Điều 28 (điểm p khoản 4), trong trường hợp cá nhân kinh doanh vận tải là người trực tiếp điều khiển phương tiện thì bị xử phạt theo quy định tại các điểm, khoản tương ứng của Điều 28 Nghị định này;”;

52.6.c:
  code_name: c
  full_name: |+
    Sửa đổi, bổ sung đoạn đầu khoản 5 Điều 80 như sau:

    - “5. Đối với các hành vi vi phạm quy định về chở người vượt quá quy định được phép chở của phương tiện, vi phạm quy định về tải trọng của phương tiện, của cầu, đường được quy định tại Điều 65 của Nghị định này, người điều khiển phương tiện, chủ phương tiện, đơn vị kinh doanh vận tải, dịch vụ hỗ trợ vận tải, cá nhân, tổ chức xếp hàng lên phương tiện giao thông đường sắt buộc chấm dứt hành vi vi phạm theo quy định cụ thể sau đây:”.

52.7:
  code_name: 7
  full_name: |+
    Sửa đổi, bổ sung khoản 4 Điều 82 như sau:

    - “4. Khi phương tiện bị tạm giữ theo quy định tại khoản 2 Điều này, chủ phương tiện phải chịu mọi chi phí (nếu có) cho việc sử dụng phương tiện khác thay thế để vận chuyển người, hàng hóa được chở trên phương tiện bị tạm giữ.”.

52.8:
  code_name: 8
  full_name: "Bãi bỏ một số điểm, khoản, điều sau đây:"

52.8.a:
  code_name: a
  full_name: "Bãi bỏ khoản 1 Điều 3;"

52.8.b:
  code_name: b
  full_name: "Bãi bỏ điểm b, điểm e, điểm g, điểm k, điểm l, điểm m, điểm q, điểm r, điểm t, điểm u, điểm v, điểm x, điểm y khoản 2 Điều 4;"

52.8.c:
  code_name: c
  full_name: "Bãi bỏ điểm a khoản 1 Điều 4a;"

52.8.d:
  code_name: d
  full_name: "Bãi bỏ Điều 5, Điều 6, Điều 7, Điều 8, Điều 9, Điều 10, Điều 11;"

52.8.đ:
  code_name: đ
  full_name: "Bãi bỏ khoản 1; điểm c khoản 2; điểm a, điểm đ khoản 3; điểm c, điểm d khoản 5; điểm e, điểm g, điểm i khoản 6; khoản 7; điểm a khoản 8 Điều 12;"

52.8.e:
  code_name: e
  full_name: "Bãi bỏ Điều 16, Điều 17, Điều 18, Điều 19, Điều 20, Điều 21, Điều 22;"

52.8.g:
  code_name: g
  full_name: "Bãi bỏ điểm a khoản 1; khoản 2; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm k, điểm m, điểm n khoản 3; khoản 4; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm h, điểm i, điểm k, điểm l, điểm m, điểm o, điểm p, điểm q khoản 5; khoản 6; khoản 7; khoản 7a Điều 23;"

52.8.h:
  code_name: h
  full_name: "Bãi bỏ khoản 1; khoản 2; khoản 3; điểm b, điểm c khoản 4; khoản 5; khoản 6; khoản 7; khoản 8; khoản 8a; khoản 9 Điều 24;"

52.8.i:
  code_name: i
  full_name: "Bãi bỏ Điều 25, Điều 26, Điều 27;"

52.8.k:
  code_name: k
  full_name: "Bãi bỏ khoản 1; điểm e, điểm g, điểm h khoản 2; điểm a khoản 3; điểm a, điểm e, điểm g, điểm q khoản 4; khoản 5; điểm c, điểm đ, điểm e, điểm g, điểm m, điểm o, điểm p khoản 6; điểm đ, điểm h, điểm i khoản 7; điểm a, điểm b khoản 8; khoản 9; điểm c, điểm d, điểm đ khoản 10; điểm c, điểm d, điểm i khoản 11 Điều 28;"

52.8.l:
  code_name: l
  full_name: "Bãi bỏ Điều 29, Điều 30, Điều 32, Điều 33, Điều 34, Điều 35, Điều 36, Điều 37, Điều 38;"

52.8.m:
  code_name: m
  full_name: "Bãi bỏ điểm a, điểm đ, điểm h khoản 2; điểm a, điểm b, điểm c, điểm d, điểm g, điểm h, điểm i khoản 3; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm i, điểm k, điểm l khoản 4; điểm a, điểm b, điểm c, điểm d, điểm đ, điểm g, điểm h, điểm i, điểm k, điểm l, điểm n, điểm p, điểm q khoản 5; khoản 6; điểm a, điểm c, điểm d khoản 8 Điều 74;"

52.8.n:
  code_name: n
  full_name: "Bãi bỏ điểm a, điểm b, điểm c, điểm d, điểm đ, điểm e, điểm g, điểm h, điểm k, điểm n khoản 3; khoản 4; điểm a, điểm b, điểm c, điểm d, điểm e khoản 5; khoản 8; khoản 10; khoản 12 Điều 80;"

52.8.o:
  code_name: o
  full_name: "Bãi bỏ điểm b, điểm g, điểm h, điểm i khoản 1; khoản 6 Điều 81;"

52.8.p:
  code_name: p
  full_name: "Bãi bỏ khoản 1, khoản 3 Điều 82."

52.9:
  code_name: 9
  full_name: "Bỏ một số cụm từ tại các điểm, khoản, điều sau đây:"

52.9.a:
  code_name: a
  full_name: "Bỏ cụm từ “camera”, cụm từ “dây an toàn” và cụm từ “thiết bị giám sát hành trình” tại điểm p khoản 2 Điều 4;"

52.9.b:
  code_name: b
  full_name: "Bỏ cụm từ “điểm a” tại điểm c khoản 1 Điều 4a;"

52.9.c:
  code_name: c
  full_name: "Bỏ cụm từ “Sử dụng trái phép lòng đường đô thị, hè phố để: Họp chợ; kinh doanh dịch vụ ăn uống; bày, bán hàng hóa; sửa chữa phương tiện, máy móc, thiết bị; rửa xe; đặt, treo biển hiệu, biển quảng cáo;” và cụm từ “, trừ các hành vi vi phạm quy định tại điểm d, điểm đ, điểm e, điểm g khoản 6; khoản 7; điểm a khoản 8 Điều này” tại điểm b khoản 5 Điều 12;"

52.9.d:
  code_name: d
  full_name: "Bỏ cụm từ “Điều 9, Điều 10, Điều 11,” tại điểm đ khoản 3, cụm từ “Điều 32, Điều 34;” tại điểm k khoản 3, cụm từ “điểm a khoản 2 Điều 16; điểm a khoản 6 Điều 23; điểm a khoản 2 Điều 32” tại khoản 3a và cụm từ “Điểm a khoản 1,” tại điểm g khoản 4 Điều 74."

53:
  code_name: 53
  full_name: Hiệu lực thi hành

53.1:
  code_name: 1
  full_name: "Nghị định này có hiệu lực thi hành từ ngày 01 tháng 01 năm 2025, trừ quy định tại khoản 2 Điều này."

53.2:
  code_name: 2
  full_name: "Quy định tại điểm m khoản 3 Điều 6, điểm e khoản 4 Điều 26, điểm b khoản 1 Điều 27 của Nghị định này có hiệu lực thi hành từ ngày 01 tháng 01 năm 2026; quy định tại điểm b khoản 1 Điều 32 của Nghị định này có hiệu lực thi hành theo quy định của pháp luật bảo vệ môi trường về kiểm định khí thải xe mô tô, xe gắn máy."

54:
  code_name: 54
  full_name: khoản chuyển tiế

54.1:
  code_name: 1
  full_name: "Trường hợp hành vi vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ xảy ra và kết thúc trước ngày Nghị định này có hiệu lực thi hành sau đó mới bị phát hiện hoặc đang xem xét giải quyết thì áp dụng nghị định đang có hiệu lực tại thời điểm thực hiện hành vi vi phạm để xử phạt."

54.2:
  code_name: 2
  full_name: "Trường hợp hành vi vi phạm hành chính đang được thực hiện, thì áp dụng nghị định đang có hiệu lực tại thời điểm phát hiện hành vi vi phạm để xử phạt."

55:
  code_name: 55
  full_name: |+
    Trách nhiệm thi hành

    Các Bộ trưởng, Thủ trưởng cơ quan ngang bộ, Thủ trưởng cơ quan thuộc Chính phủ, Chủ tịch Ủy ban nhân dân các tỉnh, thành phố trực thuộc trung ương và các cơ quan, đơn vị có liên quan chịu trách nhiệm thi hành Nghị định này./.
`
